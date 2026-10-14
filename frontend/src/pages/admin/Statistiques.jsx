import Badge from '@/components/ui/Badge'
import Loader from '@/components/ui/Loader'
import Notice from '@/components/ui/Notice'
import { useFetch } from '@/hooks/useFetch'
import { lireStats } from '@/features/admin/admin.api'
import { TYPES_DOCUMENT, VERDICTS } from '@/utils/constants'

const SEUILS = [
  {
    cle: 'disposition_a_payer',
    titre: 'Disposition à payer',
    regle: 'Validé à 5 paiements sur 15 · invalidé sous 2 sur 15',
    denominateur: 'Demandes créées',
  },
  {
    cle: 'un_seul_deplacement',
    titre: 'Un seul déplacement',
    regle: 'Validé à 8 sur 10 · invalidé sous 5 sur 10',
    denominateur: 'Demandes clôturées',
  },
  {
    cle: 'document_obtenu',
    titre: 'Document obtenu',
    regle: 'Validé à 8 sur 10 · invalidé sous 5 sur 10 (à confirmer)',
    denominateur: 'Demandes payées dont le délai de 3 semaines est écoulé ou le scan reçu',
  },
]

export default function Statistiques() {
  const { data, loading, error } = useFetch(lireStats)
  if (loading) return <Loader />
  if (error) return <Notice>{error}</Notice>

  return (
    <section>
      <h1>Statistiques du test</h1>
      <p className="hint">
        Seuils fixés avant le test : ne pas les modifier après les résultats. Aucun verdict n'est rendu
        sous 10 cas.
      </p>

      <h2>Seuils</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Hypothèse</th><th>Résultat</th><th>Verdict</th><th>Règle</th><th>Dénominateur</th></tr>
          </thead>
          <tbody>
            {SEUILS.map((s) => {
              const v = data.seuils[s.cle]
              const verdict = VERDICTS[v.verdict]
              return (
                <tr key={s.cle}>
                  <td>{s.titre}</td>
                  <td>{v.nombre} / {v.total}</td>
                  <td><Badge tone={verdict.tone}>{verdict.label}</Badge></td>
                  <td>{s.regle}</td>
                  <td>{s.denominateur}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <h2>Délais réels des établissements</h2>
      {data.delaisReels.length === 0 ? (
        <p className="hint">Aucun délai mesuré pour l'instant.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Établissement</th><th>Document</th><th>Ancien</th><th>Cas</th><th>Moyenne (j)</th><th>Min</th><th>Max</th></tr>
            </thead>
            <tbody>
              {data.delaisReels.map((l, i) => (
                <tr key={i}>
                  <td>{l.etablissement}</td>
                  <td>{TYPES_DOCUMENT[l.typeDocument]}</td>
                  <td>{l.ancien ? 'Oui' : 'Non'}</td>
                  <td>{l.nombre}</td>
                  <td>{l.moyenneJours}</td>
                  <td>{l.minJours}</td>
                  <td>{l.maxJours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2>Échéances et pièces de remplacement</h2>
      <p>
        Échéances tenues : <strong>{data.echeances.tenues}</strong> · manquées : <strong>{data.echeances.manquees}</strong>
      </p>
      <p>Cas où une pièce de remplacement a suffi : <strong>{data.piecesRemplacementSuffisantes}</strong></p>

      <h2>Refus de payer</h2>
      {data.refusDePayer.length === 0 ? (
        <p className="hint">Aucun refus consigné.</p>
      ) : (
        <ul className="list">
          {data.refusDePayer.map((r, i) => (
            <li key={i}><span>{r.reference}</span><span className="hint">{r.motif}</span></li>
          ))}
        </ul>
      )}
    </section>
  )
}
