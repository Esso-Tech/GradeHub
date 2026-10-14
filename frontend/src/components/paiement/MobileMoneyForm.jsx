import { useState } from 'react'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import { OPERATEURS } from '@/utils/constants'

export default function MobileMoneyForm({ montantLabel, onSubmit, loading }) {
  const [operateur, setOperateur] = useState('TMONEY')
  const [telephone, setTelephone] = useState('')

  return (
    <form
      className="form"
      onSubmit={(e) => { e.preventDefault(); onSubmit({ operateur, telephone }) }}
    >
      <fieldset className="fieldset">
        <legend>Payer par mobile money</legend>
        <div className="radios" role="radiogroup" aria-label="Opérateur">
          {Object.entries(OPERATEURS).map(([k, v]) => (
            <label key={k} className="check">
              <input type="radio" name="operateur" checked={operateur === k} onChange={() => setOperateur(k)} />
              <span>{v}</span>
            </label>
          ))}
        </div>
        <Field label="Numéro qui paie" hint="Vous recevrez une demande de confirmation sur ce numéro.">
          {(id) => (
            <input id={id} className="input" type="tel" inputMode="tel" required
              pattern="^\+?[0-9 ]{8,15}$" placeholder="+228 90 00 00 00"
              value={telephone} onChange={(e) => setTelephone(e.target.value)} />
          )}
        </Field>
      </fieldset>
      <Button type="submit" loading={loading}>Payer {montantLabel}</Button>
    </form>
  )
}
