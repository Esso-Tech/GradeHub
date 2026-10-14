import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Notice from '@/components/ui/Notice'
import MandatForm from './MandatForm'
import { creerDemande, devis } from '@/features/demandes/demandes.api'
import { messageErreur } from '@/services/api'
import { TYPES_DOCUMENT } from '@/utils/constants'
import { formatXof } from '@/utils/format'

const ANNEE = new Date().getFullYear()
const VIDE = {
  etablissementId: '', typeDocument: 'CEPD', anneeSortie: ANNEE, eleveNom: '', elevePrenom: '',
  dateNaissance: '', urgence: false, echeanceExterieure: '', motifEcheance: '',
}

export default function DemandeForm({ etablissements }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(VIDE)
  const [mandat, setMandat] = useState({ mandantNom: '', consentementDepot: false, consentementTransmission: false })
  const [tarif, setTarif] = useState(null)
  const [erreurTarif, setErreurTarif] = useState('')
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  // Devis en direct : prix, délai annoncé
  useEffect(() => {
    setTarif(null)
    setErreurTarif('')
    if (!form.etablissementId || !form.anneeSortie) return
    let annule = false
    devis({ etablissementId: form.etablissementId, anneeSortie: form.anneeSortie, urgence: form.urgence })
      .then((d) => !annule && setTarif(d))
      .catch((e) => !annule && setErreurTarif(messageErreur(e)))
    return () => { annule = true }
  }, [form.etablissementId, form.anneeSortie, form.urgence])

  async function onSubmit(e) {
    e.preventDefault()
    setErreur('')
    setEnvoi(true)
    try {
      const demande = await creerDemande({
        etablissementId: form.etablissementId,
        typeDocument: form.typeDocument,
        anneeSortie: Number(form.anneeSortie),
        eleveNom: form.eleveNom,
        elevePrenom: form.elevePrenom,
        dateNaissance: form.dateNaissance || undefined,
        urgence: form.urgence,
        echeanceExterieure: form.echeanceExterieure || undefined,
        motifEcheance: form.motifEcheance || undefined,
        mandat: { ...mandat, consentementDepot: true, consentementTransmission: true },
      })
      navigate(`/famille/demandes/${demande.id}/paiement`)
    } catch (err) {
      setErreur(messageErreur(err))
      setEnvoi(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="form">
      <fieldset className="fieldset">
        <legend>Le document</legend>
        <Field label="Établissement">
          {(id) => (
            <select id={id} className="input" required value={form.etablissementId}
              onChange={(e) => set('etablissementId', e.target.value)}>
              <option value="">Choisir…</option>
              {etablissements.map((e) => <option key={e.id} value={e.id}>{e.nom}</option>)}
            </select>
          )}
        </Field>
        <Field label="Type de document">
          {(id) => (
            <select id={id} className="input" value={form.typeDocument}
              onChange={(e) => set('typeDocument', e.target.value)}>
              {Object.entries(TYPES_DOCUMENT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          )}
        </Field>
        <Field label="Année de sortie ou d'examen">
          {(id) => (
            <input id={id} className="input" type="number" required min="1990" max={ANNEE}
              value={form.anneeSortie} onChange={(e) => set('anneeSortie', e.target.value)} />
          )}
        </Field>
      </fieldset>

      <fieldset className="fieldset">
        <legend>L'élève</legend>
        <Field label="Nom">
          {(id) => <input id={id} className="input" required value={form.eleveNom}
            onChange={(e) => set('eleveNom', e.target.value)} />}
        </Field>
        <Field label="Prénom">
          {(id) => <input id={id} className="input" required value={form.elevePrenom}
            onChange={(e) => set('elevePrenom', e.target.value)} />}
        </Field>
        <Field label="Date de naissance (facultatif)">
          {(id) => <input id={id} className="input" type="date" value={form.dateNaissance}
            onChange={(e) => set('dateNaissance', e.target.value)} />}
        </Field>
      </fieldset>

      <fieldset className="fieldset">
        <legend>Votre échéance</legend>
        <Field label="Date limite fixée par un organisme (facultatif)"
          hint="Bourse, concours, inscription… Nous vous rappelons cette date avant son arrivée.">
          {(id) => <input id={id} className="input" type="date" value={form.echeanceExterieure}
            onChange={(e) => set('echeanceExterieure', e.target.value)} />}
        </Field>
        {form.echeanceExterieure && (
          <Field label="Pour quelle démarche ?">
            {(id) => <input id={id} className="input" maxLength={200} value={form.motifEcheance}
              onChange={(e) => set('motifEcheance', e.target.value)} />}
          </Field>
        )}
        <label className="check">
          <input type="checkbox" checked={form.urgence} onChange={(e) => set('urgence', e.target.checked)} />
          <span>Demande urgente (formule express)</span>
        </label>
      </fieldset>

      <section className="card" aria-live="polite">
        <h3>Prix et délai</h3>
        {erreurTarif && <Notice>{erreurTarif}</Notice>}
        {!tarif && !erreurTarif && <p className="hint">Choisissez un établissement pour voir le prix.</p>}
        {tarif && (
          <>
            <p><strong>{formatXof(tarif.totalXof)}</strong> à payer maintenant (suivi{tarif.fraisExpressXof > 0 ? ' + express' : ''}).</p>
            <p className="hint">L'envoi de l'original est facturé en plus, au coût réel.</p>
            <p>
              {tarif.delaiAnnonceJours != null
                ? `Délai annoncé : ${tarif.delaiAnnonceJours} jours${tarif.ancien ? ' (document de plus de deux ans : délai majoré)' : ''}.`
                : "Délai : communiqué dès que nous aurons mesuré celui de cet établissement."}
            </p>
          </>
        )}
      </section>

      <MandatForm value={mandat} onChange={setMandat} />

      <Notice>{erreur}</Notice>
      <Button type="submit" loading={envoi} disabled={!!erreurTarif}>Valider et payer</Button>
    </form>
  )
}
