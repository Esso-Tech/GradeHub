import { Navigate } from 'react-router-dom'
import LandingBenefits from '@/components/landing/LandingBenefits'
import LandingCta from '@/components/landing/LandingCta'
import LandingDocuments from '@/components/landing/LandingDocuments'
import LandingFaq from '@/components/landing/LandingFaq'
import LandingHero from '@/components/landing/LandingHero'
import LandingSteps from '@/components/landing/LandingSteps'
import LandingTogether from '@/components/landing/LandingTogether'
import LandingTrustBar from '@/components/landing/LandingTrustBar'
import LandingMotion from '@/components/landing/LandingMotion'
import LandingReveal from '@/components/landing/LandingReveal'
import Loader from '@/components/ui/Loader'
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
    <div className="landing landing--motion">
      <LandingHero />
      <LandingTrustBar />
      <LandingTogether />
      <div className="landing-body">
        <LandingReveal>
          <LandingDocuments />
        </LandingReveal>
        <LandingReveal>
          <LandingSteps />
        </LandingReveal>
        <LandingReveal>
          <LandingBenefits />
        </LandingReveal>
        <LandingReveal>
          <LandingFaq />
        </LandingReveal>
        <LandingReveal>
          <LandingCta />
        </LandingReveal>
      </div>
      <LandingMotion />
    </div>
  )
}
