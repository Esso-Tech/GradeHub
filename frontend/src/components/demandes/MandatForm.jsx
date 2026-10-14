import Field from '@/components/ui/Field'

/** Mandat de la famille : sans lui, GRADE HUB ne dépose ni ne transmet rien. */
export default function MandatForm({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v })
  return (
    <fieldset className="fieldset">
      <legend>Mandat à GRADE HUB</legend>
      <Field label="Nom et prénom du mandant" hint="La personne qui confie la demande (élève, ancien élève ou parent).">
        {(id) => (
          <input id={id} className="input" required minLength={2} value={value.mandantNom}
            onChange={(e) => set('mandantNom', e.target.value)} />
        )}
      </Field>
      <label className="check">
        <input type="checkbox" required checked={value.consentementDepot}
          onChange={(e) => set('consentementDepot', e.target.checked)} />
        <span>Je mandate GRADE HUB pour déposer et suivre cette demande auprès de l'établissement.</span>
      </label>
      <label className="check">
        <input type="checkbox" required checked={value.consentementTransmission}
          onChange={(e) => set('consentementTransmission', e.target.checked)} />
        <span>
          J'accepte que les informations de l'élève et le scan du document soient transmis par GRADE HUB
          à moi-même, et uniquement à moi.
        </span>
      </label>
    </fieldset>
  )
}
