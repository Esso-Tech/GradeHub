import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { user } = useAuth()
  const cible = user ? (user.role === 'ADMIN' ? '/admin' : '/famille') : '/inscription'
  return (
    <section>
      <h1>Votre document scolaire, sans courir après le secrétariat</h1>
      <p>
        Confiez votre demande à GRADE HUB. Nous la suivons auprès de l'établissement, vous savez où
        elle en est, vous recevez le scan dès la signature, puis l'original.
      </p>
      <p><Link className="btn btn-primary" to={cible}>{user ? 'Mon espace' : 'Faire une demande'}</Link></p>
      <p className="hint">Documents concernés : CEPD, BEPC et relevés de notes de la Seconde à la Terminale.</p>
    </section>
  )
}
