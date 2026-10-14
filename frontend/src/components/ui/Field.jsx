import { useId } from 'react'

/** Libellé + champ. `children` reçoit l'id à relier : <Field>{(id) => <input id={id} />}</Field> */
export default function Field({ label, hint, error, children }) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children(id)}
      {hint && <p className="hint">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
