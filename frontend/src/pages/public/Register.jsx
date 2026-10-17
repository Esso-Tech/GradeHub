import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Notice from '@/components/ui/Notice'
import { IllPhone } from '@/components/illustrations'
import { IconCheck } from '@/components/ui/SiteIcons'
import { useAuth } from '@/hooks/useAuth'
import { messageErreur } from '@/services/api'

const AVANTAGES = [
  'Un seul endroit pour toutes vos demandes',
  'Un message à chaque étape, par WhatsApp ou SMS',
  "Le scan dès la signature, puis l'original chez vous",
]

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
    <section className="hero">
      <div className="container auth-split">
        <div className="auth-split__intro">
          <p className="kicker">Créer un compte</p>
          <h1 className="auth-split__title">Suivez vos documents depuis votre téléphone.</h1>
          <ul className="checks">
            {AVANTAGES.map((a) => (
              <li key={a}><IconCheck size={22} /><span>{a}</span></li>
            ))}
          </ul>
          <div className="auth-split__visual"><IllPhone /></div>
        </div>

        <div className="surface auth-split__card">
          <form onSubmit={onSubmit} className="form">
            <h2>Votre compte</h2>
            <Field label="Nom et prénom">
              {(id) => (
                <input id={id} className="input" required minLength={2} autoComplete="name"
                  value={form.nom} onChange={(e) => set('nom', e.target.value)} />
              )}
            </Field>
            <Field label="E-mail">
              {(id) => (
                <input id={id} className="input" type="email" required autoComplete="email"
                  value={form.email} onChange={(e) => set('email', e.target.value)} />
              )}
            </Field>
            <Field label="Téléphone" hint="Nous vous écrivons sur ce numéro, par WhatsApp ou SMS.">
              {(id) => (
                <input id={id} className="input" type="tel" required autoComplete="tel"
                  pattern="^\+?[0-9 ]{8,15}$" placeholder="+228 90 00 00 00"
                  value={form.telephone} onChange={(e) => set('telephone', e.target.value)} />
              )}
            </Field>
            <Field label="Mot de passe" hint="8 caractères minimum.">
              {(id) => (
                <input id={id} className="input" type="password" required minLength={8}
                  autoComplete="new-password" value={form.motDePasse}
                  onChange={(e) => set('motDePasse', e.target.value)} />
              )}
            </Field>
            <Notice>{erreur}</Notice>
            <Button type="submit" loading={loading}>Créer mon compte</Button>
          </form>
          <p className="hint auth-split__login">Déjà un compte ? <Link to="/connexion">Se connecter</Link></p>
        </div>
      </div>
    </section>
  )
}
