import { Link, Navigate } from 'react-router-dom'
import Loader from '@/components/ui/Loader'
import MetricCard from '@/components/ui/MetricCard'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) return <Loader />

  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />
  }
  if (user?.role === 'FAMILLE') {
    return <Navigate to="/famille" replace />
  }

  return (
    <section className="landing">
      <div className="landing__hero surface">
        <p className="landing__kicker">Lomé · Documents scolaires</p>
        <h1>Votre document scolaire, sans courir après le secrétariat</h1>
        <p className="landing__lead">
          Confiez votre demande à GRADE HUB. Nous la suivons auprès de l&apos;établissement,
          vous savez où elle en est, vous recevez le scan dès la signature, puis l&apos;original.
        </p>
        <div className="landing__actions">
          <Link className="btn btn-primary btn-lg" to="/inscription">
            Faire une demande
          </Link>
          <Link className="btn btn-secondary btn-lg" to="/tarifs">
            Voir les tarifs
          </Link>
        </div>
        <p className="hint">CEPD, BEPC et relevés de notes (Seconde à Terminale).</p>
      </div>

      <div className="metric-grid metric-grid--landing">
        <MetricCard icon="payment" tone="red" value="1 500" label="XOF · frais de suivi" />
        <MetricCard icon="phone" tone="green" value="SMS" label="WhatsApp · alertes" />
        <MetricCard icon="document" tone="blue" value="Scan" label="Dès signature" />
        <MetricCard icon="package" tone="cyan" value="Original" label="Remise en main propre" />
      </div>
    </section>
  )
}
