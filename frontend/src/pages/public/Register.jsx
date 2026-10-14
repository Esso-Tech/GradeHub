import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Notice from '@/components/ui/Notice'
import { useAuth } from '@/hooks/useAuth'
import { messageErreur } from '@/services/api'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', motDePasse: '' })
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErreur('')
    try {
      await register(form)
      navigate('/famille/nouvelle', { replace: true })
    } catch (err) {
      setErreur(messageErreur(err))
      setLoading(false)
    }
  }

  return (
    <section className="narrow">
      <h1>Créer un compte</h1>
      <form onSubmit={onSubmit} className="form">
        <Field label="Nom et prénom">
          {(id) => <input id={id} className="input" required minLength={2} autoComplete="name"
            value={form.nom} onChange={(e) => set('nom', e.target.value)} />}
        </Field>
        <Field label="E-mail">
          {(id) => <input id={id} className="input" type="email" required autoComplete="email"
            value={form.email} onChange={(e) => set('email', e.target.value)} />}
        </Field>
        <Field label="Téléphone" hint="Nous vous écrivons sur ce numéro (WhatsApp ou SMS) à chaque étape.">
          {(id) => <input id={id} className="input" type="tel" required autoComplete="tel"
            pattern="^\+?[0-9 ]{8,15}$" placeholder="+228 90 00 00 00"
            value={form.telephone} onChange={(e) => set('telephone', e.target.value)} />}
        </Field>
        <Field label="Mot de passe" hint="8 caractères minimum.">
          {(id) => <input id={id} className="input" type="password" required minLength={8}
            autoComplete="new-password" value={form.motDePasse}
            onChange={(e) => set('motDePasse', e.target.value)} />}
        </Field>
        <Notice>{erreur}</Notice>
        <Button type="submit" loading={loading}>Créer mon compte</Button>
      </form>
      <p className="hint">Déjà un compte ? <Link to="/connexion">Se connecter</Link></p>
    </section>
  )
}
