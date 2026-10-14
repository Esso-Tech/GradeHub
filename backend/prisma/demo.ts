/**
 * Données FICTIVES pour démonstration (séance, tests visuels).
 *   npm run demo         crée les données
 *   npm run demo:reset   supprime uniquement les données de démo
 * Tout ce qui est créé porte « DEMO » (e-mail @demo.gradehub.local, établissements « [DEMO] »).
 * Ces chiffres ne sont PAS des résultats du test : ne jamais les présenter comme tels.
 */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import bcrypt from 'bcryptjs'
import { PrismaClient, type StatutDemande, type TypeDocument } from '@prisma/client'

const prisma = new PrismaClient()
const DOMAINE = '@demo.gradehub.local'
const EMAIL = `famille${DOMAINE}`
const MOT_DE_PASSE = 'Demo-12345'
const JOUR = 24 * 60 * 60 * 1000
const STORAGE = path.resolve(process.env.STORAGE_DIR ?? './uploads')

const PARCOURS: StatutDemande[] = [
  'EN_ATTENTE_PAIEMENT', 'PAYEE', 'DEPOSEE_ETABLISSEMENT', 'EN_COURS',
  'SIGNEE', 'SCAN_ENVOYE', 'ORIGINAL_ENVOYE', 'CLOTUREE',
]

const PDF_DEMO = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 150]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 62>>stream
BT /F1 14 Tf 20 80 Td (Scan de demonstration - fictif) Tj ET
endstream endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
trailer<</Root 1 0 R/Size 6>>
%%EOF
`

interface Scenario {
  type: TypeDocument
  annee: number
  statut: StatutDemande
  age: number // jours depuis la création
  delai?: number // jours entre dépôt à l'établissement et signature
  deplacements?: number
  echeanceDans?: number // jours à partir de la création (date limite extérieure)
  echeanceTenue?: boolean
  remplacement?: boolean
  refus?: string
  etab?: 'public' | 'prive'
}

const A = new Date().getFullYear()
const SCENARIOS: Scenario[] = [
  // Clôturées (10) : alimentent le seuil « un seul déplacement »
  { type: 'CEPD', annee: A - 1, statut: 'CLOTUREE', age: 40, delai: 9, deplacements: 1, echeanceDans: 20, echeanceTenue: true },
  { type: 'BEPC', annee: A - 1, statut: 'CLOTUREE', age: 38, delai: 12, deplacements: 1, echeanceDans: 25, echeanceTenue: true },
  { type: 'RELEVE_NOTES', annee: A - 1, statut: 'CLOTUREE', age: 35, delai: 8, deplacements: 1 },
  { type: 'RELEVE_NOTES', annee: A - 4, statut: 'CLOTUREE', age: 33, delai: 14, deplacements: 2, echeanceDans: 12, echeanceTenue: false },
  { type: 'CEPD', annee: A - 2, statut: 'CLOTUREE', age: 30, delai: 10, deplacements: 1, echeanceDans: 18, echeanceTenue: true },
  { type: 'BEPC', annee: A - 1, statut: 'CLOTUREE', age: 28, delai: 11, deplacements: 0, remplacement: true, echeanceDans: 14, echeanceTenue: true },
  { type: 'RELEVE_NOTES', annee: A - 1, statut: 'CLOTUREE', age: 26, delai: 7, deplacements: 2 },
  { type: 'RELEVE_NOTES', annee: A - 5, statut: 'CLOTUREE', age: 25, delai: 15, deplacements: 2, echeanceDans: 15, echeanceTenue: false },
  { type: 'RELEVE_NOTES', annee: A - 1, statut: 'CLOTUREE', age: 24, delai: 9, deplacements: 1 },
  { type: 'CEPD', annee: A - 1, statut: 'CLOTUREE', age: 22, delai: 10, deplacements: 1 },
  // En cours de parcours
  { type: 'CEPD', annee: A - 1, statut: 'ORIGINAL_ENVOYE', age: 20, delai: 9, deplacements: 1 },
  { type: 'BEPC', annee: A - 1, statut: 'SCAN_ENVOYE', age: 15, delai: 10, deplacements: 1, etab: 'prive' },
  { type: 'RELEVE_NOTES', annee: A - 1, statut: 'SIGNEE', age: 12, delai: 8 },
  { type: 'CEPD', annee: A - 1, statut: 'EN_COURS', age: 8 },
  { type: 'BEPC', annee: A - 1, statut: 'PIECE_MANQUANTE', age: 6, etab: 'prive' },
  { type: 'RELEVE_NOTES', annee: A - 1, statut: 'PAYEE', age: 2, echeanceDans: 4 }, // date limite proche
  // Début de parcours, refus, annulation
  { type: 'CEPD', annee: A - 1, statut: 'EN_ATTENTE_PAIEMENT', age: 1 },
  { type: 'RELEVE_NOTES', annee: A - 1, statut: 'EN_ATTENTE_PAIEMENT', age: 5, refus: 'Je préfère aller sur place' },
  { type: 'BEPC', annee: A - 1, statut: 'ANNULEE', age: 18 },
]

async function reset() {
  const users = await prisma.user.findMany({ where: { email: { endsWith: DOMAINE } }, select: { id: true } })
  const ids = users.map((u) => u.id)
  // Les mandats, paiements, scans, journaux et notifications partent avec la demande (cascade)
  const d = await prisma.demande.deleteMany({ where: { userId: { in: ids } } })
  await prisma.user.deleteMany({ where: { id: { in: ids } } })
  await prisma.etablissement.deleteMany({ where: { nom: { startsWith: '[DEMO]' } } })
  await fs.promises.rm(path.join(STORAGE, 'demo'), { recursive: true, force: true })
  console.log(`Démo supprimée (${d.count} demandes).`)
}

async function creer() {
  await reset()

  const user = await prisma.user.create({
    data: {
      email: EMAIL,
      nom: 'Famille Démo',
      telephone: '+22890000000',
      passwordHash: await bcrypt.hash(MOT_DE_PASSE, 12),
    },
  })
  const [pub, prive] = await Promise.all([
    prisma.etablissement.create({
      data: { nom: '[DEMO] Lycée public de démonstration', type: 'PUBLIC', accordCadreSigne: true, delaiMesureJours: 10 },
    }),
    prisma.etablissement.create({
      data: { nom: '[DEMO] Collège privé de démonstration', type: 'PRIVE' },
    }),
  ])

  await fs.promises.mkdir(path.join(STORAGE, 'demo'), { recursive: true })
  const maintenant = Date.now()

  for (const [i, s] of SCENARIOS.entries()) {
    const ref = `GH-DEMO-${String(i + 1).padStart(4, '0')}`
    const etab = s.etab === 'prive' ? prive : pub
    const ancien = A - s.annee > 2
    const cree = maintenant - s.age * JOUR
    const au = (jours: number) => new Date(Math.min(cree + jours * JOUR, maintenant))

    // Chemin parcouru jusqu'au statut courant
    const chemin: StatutDemande[] =
      s.statut === 'PIECE_MANQUANTE'
        ? ['EN_ATTENTE_PAIEMENT', 'PAYEE', 'DEPOSEE_ETABLISSEMENT', 'PIECE_MANQUANTE']
        : s.statut === 'ANNULEE'
          ? ['EN_ATTENTE_PAIEMENT', 'ANNULEE']
          : PARCOURS.slice(0, PARCOURS.indexOf(s.statut) + 1)

    const delai = s.delai ?? 10
    const jourDepot = 0.5
    const jourSignature = jourDepot + delai
    const jourDe: Partial<Record<StatutDemande, number>> = {
      PAYEE: 0.1, DEPOSEE_ETABLISSEMENT: jourDepot, EN_COURS: 1, PIECE_MANQUANTE: 2,
      SIGNEE: jourSignature, SCAN_ENVOYE: jourSignature + 0.2,
      ORIGINAL_ENVOYE: jourSignature + 1, CLOTUREE: jourSignature + 2, ANNULEE: 1,
    }

    const aScan = chemin.includes('SCAN_ENVOYE')
    const paye = chemin.includes('PAYEE')
    const cleScan = `demo/${ref}.pdf`
    if (aScan) await fs.promises.writeFile(path.join(STORAGE, cleScan), PDF_DEMO)

    const demande = await prisma.demande.create({
      data: {
        reference: ref,
        userId: user.id,
        etablissementId: etab.id,
        typeDocument: s.type,
        anneeSortie: s.annee,
        eleveNom: 'Démo',
        elevePrenom: `Élève ${i + 1}`,
        echeanceExterieure: s.echeanceDans != null ? new Date(cree + s.echeanceDans * JOUR) : null,
        motifEcheance: s.echeanceDans != null ? 'Démarche fictive (démo)' : null,
        statut: s.statut,
        ancien,
        delaiAnnonceJours: etab.delaiMesureJours != null ? Math.ceil(etab.delaiMesureJours * (ancien ? 1.5 : 1)) : null,
        fraisSuiviXof: 1500,
        coutEnvoiXof: chemin.includes('ORIGINAL_ENVOYE') ? 1000 : null,
        adresseEnvoi: chemin.includes('ORIGINAL_ENVOYE') ? 'Adresse fictive, Lomé' : null,
        nbDeplacements: s.deplacements ?? 0,
        echeanceTenue: s.echeanceTenue ?? null,
        pieceRemplacementSuffisante: s.remplacement ?? null,
        dateDepotEtablissement: chemin.includes('DEPOSEE_ETABLISSEMENT') ? au(jourDepot) : null,
        dateSignature: chemin.includes('SIGNEE') ? au(jourSignature) : null,
        dateObtention: aScan ? au(jourSignature + 0.2) : null,
        clotureeLe: s.statut === 'CLOTUREE' ? au(jourDe.CLOTUREE!) : null,
        createdAt: new Date(cree),
        mandat: {
          create: {
            mandantNom: 'Famille Démo',
            consentementDepot: true,
            consentementTransmission: true,
            accepteLe: new Date(cree),
          },
        },
        paiements: {
          create: [
            ...(paye
              ? [{ type: 'SUIVI' as const, montantXof: 1500, operateur: 'TMONEY' as const, telephone: '+22890000000',
                  statut: 'CONFIRME' as const, referenceExterne: `DEMO-${ref}`, confirmeLe: au(0.1), createdAt: au(0.05) }]
              : []),
            ...(s.refus
              ? [{ type: 'SUIVI' as const, montantXof: 1500, operateur: 'TMONEY' as const, telephone: '-',
                  statut: 'REFUSE' as const, motifRefus: s.refus, createdAt: au(0.2) }]
              : []),
          ],
        },
        documents: aScan
          ? { create: [{ storageKey: cleScan, mimeType: 'application/pdf', tailleOctets: PDF_DEMO.length, createdAt: au(jourSignature + 0.2) }] }
          : undefined,
      },
    })

    // Journal daté
    const evenements = [
      { type: 'DEMANDE_CREEE', statutApres: 'EN_ATTENTE_PAIEMENT' as StatutDemande, message: 'Demande créée, mandat accepté', createdAt: new Date(cree) },
      ...chemin.slice(1).map((statut, k) => ({
        type: 'CHANGEMENT_STATUT',
        statutAvant: chemin[k],
        statutApres: statut,
        message: undefined as string | undefined,
        createdAt: au(jourDe[statut] ?? 1),
      })),
      ...Array.from({ length: s.deplacements ?? 0 }, (_, k) => ({
        type: 'DEPLACEMENT', message: `Déplacement n°${k + 1}`, createdAt: au(jourSignature + 1 + k * 0.1),
      })),
      ...(s.refus ? [{ type: 'PAIEMENT_REFUSE', message: s.refus, createdAt: au(0.2) }] : []),
    ]
    await prisma.journalEvenement.createMany({
      data: evenements.map((e) => ({ demandeId: demande.id, ...e })),
    })
  }

  console.log(`Démo créée : ${SCENARIOS.length} demandes fictives.`)
  console.log(`Famille : ${EMAIL} / ${MOT_DE_PASSE}`)
  console.log(`Admin   : ${process.env.SEED_ADMIN_EMAIL ?? 'admin@gradehub.local'} (voir npm run seed)`)
}

const commande = process.argv[2]
;(commande === 'reset' ? reset() : creer())
  .catch((e) => { console.error(e); process.exitCode = 1 })
  .finally(() => prisma.$disconnect())
