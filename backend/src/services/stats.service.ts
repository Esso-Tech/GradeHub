import { prisma } from '../config/db'
import { joursEntre } from '../utils/dates'
import { SEUILS, verdict } from '../utils/seuils'

/**
 * Indicateurs du test MVP. Les dénominateurs sont explicites pour éviter de mêler 15 et 10.
 */
export async function calculerStats(now = new Date()) {
  const demandes = await prisma.demande.findMany({
    include: {
      etablissement: { select: { nom: true } },
      paiements: { select: { type: true, statut: true, motifRefus: true } },
    },
  })

  // 1. Disposition à payer : demandes avec un frais de suivi confirmé / demandes créées
  const totalDemandes = demandes.length
  const payees = demandes.filter((d) =>
    d.paiements.some((p) => p.type === 'SUIVI' && p.statut === 'CONFIRME'),
  )

  // 2. Un seul déplacement : demandes clôturées avec 0 ou 1 déplacement / demandes clôturées
  const cloturees = demandes.filter((d) => d.statut === 'CLOTUREE')
  const unSeulDepl = cloturees.filter((d) => d.nbDeplacements <= 1)

  // 3. Document obtenu : scan reçu dans le délai / demandes payées dont le délai est écoulé ou le scan reçu
  const delaiMs = SEUILS.documentObtenu.delaiJours * 24 * 60 * 60 * 1000
  const evaluables = payees.filter(
    (d) => d.dateObtention || now.getTime() - d.createdAt.getTime() > delaiMs,
  )
  const obtenues = evaluables.filter(
    (d) => d.dateObtention && d.dateObtention.getTime() - d.createdAt.getTime() <= delaiMs,
  )

  // Délais réels : dépôt à l'établissement → signature, par établissement et type de document
  const groupes = new Map<string, { etablissement: string; typeDocument: string; ancien: boolean; jours: number[] }>()
  for (const d of demandes) {
    if (!d.dateDepotEtablissement || !d.dateSignature) continue
    const cle = `${d.etablissementId}|${d.typeDocument}|${d.ancien}`
    const g = groupes.get(cle) ?? {
      etablissement: d.etablissement.nom,
      typeDocument: d.typeDocument,
      ancien: d.ancien,
      jours: [],
    }
    g.jours.push(joursEntre(d.dateDepotEtablissement, d.dateSignature))
    groupes.set(cle, g)
  }
  const delaisReels = [...groupes.values()].map((g) => ({
    etablissement: g.etablissement,
    typeDocument: g.typeDocument,
    ancien: g.ancien,
    nombre: g.jours.length,
    moyenneJours: Math.round((g.jours.reduce((a, b) => a + b, 0) / g.jours.length) * 10) / 10,
    minJours: Math.min(...g.jours),
    maxJours: Math.max(...g.jours),
  }))

  const refus = demandes.flatMap((d) =>
    d.paiements.filter((p) => p.statut === 'REFUSE').map((p) => ({ reference: d.reference, motif: p.motifRefus })),
  )

  return {
    seuils: {
      disposition_a_payer: {
        nombre: payees.length,
        total: totalDemandes,
        verdict: verdict(payees.length, totalDemandes, SEUILS.paiement),
      },
      un_seul_deplacement: {
        nombre: unSeulDepl.length,
        total: cloturees.length,
        verdict: verdict(unSeulDepl.length, cloturees.length, SEUILS.unSeulDeplacement),
      },
      document_obtenu: {
        nombre: obtenues.length,
        total: evaluables.length,
        delaiJours: SEUILS.documentObtenu.delaiJours,
        verdict: verdict(obtenues.length, evaluables.length, SEUILS.documentObtenu),
      },
    },
    delaisReels,
    refusDePayer: refus,
    piecesRemplacementSuffisantes: demandes.filter((d) => d.pieceRemplacementSuffisante).length,
    echeances: {
      tenues: demandes.filter((d) => d.echeanceTenue === true).length,
      manquees: demandes.filter((d) => d.echeanceTenue === false).length,
    },
  }
}
