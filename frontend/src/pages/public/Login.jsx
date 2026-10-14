import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Notice from '@/components/ui/Notice'
import WidgetCard from '@/components/ui/WidgetCard'
import { useAuth } from '@/hooks/useAuth'
import { messageErreur } from '@/services/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErreur('')
    try {
      const user = await login(email, motDePasse)
      const defaut = user.role === 'ADMIN' ? '/admin' : '/famille'
      navigate(location.state?.from ?? defaut, { replace: true })
    } catch (err) {
      setErreur(messageErreur(err))
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <WidgetCard title="Connexion" description="Accédez à votre espace famille ou administration." className="auth-card">
        <form onSubmit={onSubmit} className="form">
          <Field label="E-mail">
            {(id) => (
              <input
                id={id}
                className="input"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
          </Field>
          <Field label="Mot de passe">
            {(id) => (
              <input
                id={id}
                className="input"
                type="password"
                autoComplete="current-password"
                required
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
              />
            )}
          </Field>
          <Notice>{erreur}</Notice>
          <Button type="submit" loading={loading}>Se connecter</Button>
        </form>
        <p className="hint">Pas encore de compte ? <Link to="/inscription">Créer un compte famille</Link></p>
      </WidgetCard>
    </div>
  )
}
