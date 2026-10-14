import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Select from '@/components/ui/Select'
import Loader from '@/components/ui/Loader'
import Notice from '@/components/ui/Notice'
import StatutBadge from '@/components/ui/StatutBadge'
import StatutTimeline from '@/components/demandes/StatutTimeline'
import JournalList from '@/components/demandes/JournalList'
import ScanViewer from '@/components/documents/ScanViewer'
import { useFetch } from '@/hooks/useFetch'
import { lireDemande } from '@/features/demandes/demandes.api'
import * as admin from '@/features/admin/admin.api'
import { messageErreur } from '@/services/api'
import { STATUTS, TRANSITIONS, TYPES_DOCUMENT } from '@/utils/constants'
import { formatDate, formatXof } from '@/utils/format'

/** Exécute une action admin, affiche l'erreur éventuelle, recharge la demande. */
function useAction(reload) {
  const [erreur, setErreur] = useState('')
  const [occupe, setOccupe] = useState(false)
  const lancer = async (fn) => {
    setOccupe(true)
    setErreur('')
    try {
      await fn()
      await reload(true)
      return true
    } catch (err) {
      setErreur(messageErreur(err))
      return false
    } finally {
      setOccupe(false)
    }
  }
  return { erreur, occupe, lancer }
}

export default function DetailDemandeAdmin() {
  const { id } = useParams()
  const { data: d, loading, error, reload } = useFetch(() => lireDemande(id), [id])
  const action = useAction(reload)

  const [message, setMessage] = useState('')
  const [fichier, setFichier] = useState(null)
  const [envoi, setEnvoi] = useState({ cout: '', adresse: '' })
  const [resultat, setResultat] = useState({ tenue: 'oui', remplacement: false })
  const [motifRefus, setMotifRefus] = useState('')

  if (loading) return <Loader />
  if (error) return <Notice>{error}</Notice>
  if (!d) return null

  const suivants = TRANSITIONS[d.statut]
  const peutScanner = d.statut === 'SIGNEE' || d.statut === 'SCAN_ENVOYE'
  const nbDeplacements = d.nbDeplacements

  return (
    <section>
      <p><Link to="/admin/demandes">← Demandes</Link></p>
      <h1>{d.reference}</h1>
      <p><StatutBadge statut={d.statut} /></p>

      <div className="card">
        <h3>{TYPES_DOCUMENT[d.typeDocument]} · {d.anneeSortie}{d.ancien ? ' (plus de 2 ans)' : ''}</h3>
        <dl className="dl">
          <dt>Élève</dt><dd>{d.elevePrenom} {d.eleveNom}</dd>
          <dt>Établissement</dt><dd>{d.etablissement.nom}</dd>
          <dt>Date limite</dt>
          <dd>{formatDate(d.echeanceExterieure)}{d.motifEcheance ? ` · ${d.motifEcheance}` : ''}</dd>
          <dt>Frais de suivi</dt><dd>{formatXof(d.fraisSuiviXof + d.fraisExpressXof)}</dd>
          <dt>Envoi</dt><dd>{d.coutEnvoiXof ? `${formatXof(d.coutEnvoiXof)} · ${d.adresseEnvoi}` : 'Non défini'}</dd>
          <dt>Délai annoncé</dt><dd>{d.delaiAnnonceJours != null ? `${d.delaiAnnonceJours} jours` : 'Aucun'}</dd>
          <dt>Déplacements</dt><dd>{nbDeplacements}</dd>
        </dl>
      </div>

      <StatutTimeline statut={d.statut} />
      <Notice>{action.erreur}</Notice>

      {suivants.length > 0 && (
        <div className="card">
          <h3>Changer l'état</h3>
          <Field label="Note pour le journal (facultatif)">
            {(fid) => <input id={fid} className="input" maxLength={500} value={message}
              onChange={(e) => setMessage(e.target.value)} />}
          </Field>
          <div className="actions">
            {suivants.map((s) => (
              <Button
                key={s}
                variant={s === 'ANNULEE' ? 'danger' : 'primary'}
                loading={action.occupe}
                onClick={async () => {
                  if (s === 'ANNULEE' && !window.confirm('Annuler cette demande ?')) return
                  if (await action.lancer(() => admin.changerStatut(d.id, s, message))) setMessage('')
                }}
              >
                {STATUTS[s].label}
              </Button>
            ))}
          </div>
          <p className="hint">La famille est prévenue à chaque changement d'état.</p>
        </div>
      )}

      {d.statut === 'EN_ATTENTE_PAIEMENT' && (
        <div className="card">
          <h3>Consigner un refus de payer</h3>
          <Field label="Raison donnée par la famille">
            {(fid) => <input id={fid} className="input" minLength={3} maxLength={300} value={motifRefus}
              onChange={(e) => setMotifRefus(e.target.value)} />}
          </Field>
          <Button variant="secondary" loading={action.occupe} disabled={motifRefus.trim().length < 3}
            onClick={async () => { if (await action.lancer(() => admin.consignerRefus(d.id, motifRefus.trim()))) setMotifRefus('') }}>
            Consigner le refus
          </Button>
          <p className="hint">C'est un résultat du test, pas un échec : il entre dans les statistiques.</p>
        </div>
      )}

      <div className="card">
        <h3>Déplacements</h3>
        <p>{nbDeplacements} enregistré{nbDeplacements > 1 ? 's' : ''}.</p>
        <Button variant="secondary" loading={action.occupe}
          onClick={() => action.lancer(() => admin.ajouterDeplacement(d.id))}>
          + Un déplacement
        </Button>
      </div>

      {peutScanner && (
        <div className="card">
          <h3>Scan du document signé</h3>
          <Field label="Fichier (PDF, JPEG ou PNG, 10 Mo maximum)">
            {(fid) => <input id={fid} className="input" type="file" accept="application/pdf,image/jpeg,image/png"
              onChange={(e) => setFichier(e.target.files?.[0] ?? null)} />}
          </Field>
          <Button loading={action.occupe} disabled={!fichier}
            onClick={async () => { if (await action.lancer(() => admin.ajouterScan(d.id, fichier))) setFichier(null) }}>
            Déposer le scan
          </Button>
        </div>
      )}
      {d.documents.length > 0 && (
        <div className="card">
          <h3>Scan déposé</h3>
          <ScanViewer demandeId={d.id} />
        </div>
      )}

      <div className="card">
        <h3>Envoi de l'original</h3>
        <div className="row">
          <Field label="Coût réel (F CFA)">
            {(fid) => <input id={fid} className="input" type="number" min="1" value={envoi.cout}
              onChange={(e) => setEnvoi({ ...envoi, cout: e.target.value })} />}
          </Field>
          <Field label="Adresse d'envoi">
            {(fid) => <input id={fid} className="input" minLength={5} value={envoi.adresse}
              onChange={(e) => setEnvoi({ ...envoi, adresse: e.target.value })} />}
          </Field>
        </div>
        <Button variant="secondary" loading={action.occupe}
          disabled={!envoi.cout || envoi.adresse.trim().length < 5}
          onClick={() => action.lancer(() => admin.definirEnvoi(d.id, Number(envoi.cout), envoi.adresse.trim()))}>
          Enregistrer l'envoi
        </Button>
      </div>

      <div className="card">
        <h3>Résultat pour le test</h3>
        <p className="hint">
          Actuel : échéance {d.echeanceTenue == null ? 'non renseignée' : d.echeanceTenue ? 'tenue' : 'manquée'}
          {d.pieceRemplacementSuffisante ? ' · pièce de remplacement suffisante' : ''}
        </p>
        <Field label="Échéance extérieure">
          {(fid) => (
            <Select id={fid} value={resultat.tenue}
              onChange={(e) => setResultat({ ...resultat, tenue: e.target.value })}>
              <option value="oui">Tenue</option>
              <option value="non">Manquée ou non tenue</option>
            </Select>
          )}
        </Field>
        <label className="check">
          <input type="checkbox" checked={resultat.remplacement}
            onChange={(e) => setResultat({ ...resultat, remplacement: e.target.checked })} />
          <span>Une pièce de remplacement a suffi à l'organisme</span>
        </label>
        <Button variant="secondary" loading={action.occupe}
          onClick={() => action.lancer(() => admin.enregistrerResultat(d.id, {
            echeanceTenue: resultat.tenue === 'oui',
            pieceRemplacementSuffisante: resultat.remplacement || undefined,
          }))}>
          Enregistrer le résultat
        </Button>
      </div>

      <h2>Paiements</h2>
      {d.paiements.length === 0 ? <p className="hint">Aucun paiement.</p> : (
        <ul className="list">
          {d.paiements.map((p) => (
            <li key={p.id}>
              <span>{p.type === 'SUIVI' ? 'Suivi' : 'Envoi'} · {formatXof(p.montantXof)}</span>
              <span className="hint">{p.statut}{p.motifRefus ? ` · ${p.motifRefus}` : ''}</span>
            </li>
          ))}
        </ul>
      )}

      <h2>Journal</h2>
      <JournalList journal={d.journal} />
    </section>
  )
}
