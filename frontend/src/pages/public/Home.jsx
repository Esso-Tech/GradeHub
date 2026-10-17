import { Link, Navigate } from 'react-router-dom'
import { IllDelivery, IllDoc, IllPhone, IllSchool } from '@/components/illustrations'
import Loader from '@/components/ui/Loader'
import { useAuth } from '@/hooks/useAuth'
import { FRAIS_SUIVI_XOF } from '@/utils/constants'
import { formatXof } from '@/utils/format'

const STEPS = [
  { title: 'Vous confiez la demande', text: "Vous choisissez le document et l'établissement, vous donnez votre accord, puis vous payez par mobile money." },
  { title: 'Nous suivons', text: "Nous déposons la demande et relançons l'établissement. Vous savez où elle en est." },
  { title: 'Vous recevez le scan', text: 'Dès que le document est signé, le scan est disponible dans votre espace.' },
  { title: "Vous recevez l'original", text: "L'original vous est envoyé à l'adresse que vous avez indiquée." },
]

const FIGURES = [
  { Img: IllSchool, title: "Nous allons à l'établissement", text: 'Dépôt de la demande et suivi, à votre place.' },
  { Img: IllDoc, title: 'Le scan, dès la signature', text: 'Vous pouvez avancer sur votre dossier sans attendre.' },
  { Img: IllDelivery, title: "L'original chez vous", text: "Envoi à l'adresse de votre choix, au coût réel." },
]

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) return <Loader />
  if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />
  if (user?.role === 'FAMILLE') return <Navigate to="/famille" replace />

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="kicker">Documents scolaires à Lomé</p>
            <h1 id="hero-title" className="hero__title">
              Votre document scolaire, <span className="hl">sans courir après le secrétariat</span>.
            </h1>
            <p className="lead">
              GRADE HUB dépose votre demande, la suit auprès de l&apos;établissement et vous prévient à
              chaque étape. Vous recevez le scan dès la signature, puis l&apos;original.
            </p>
            <div className="btn-row">
              <Link className="btn btn-primary btn-lg" to="/inscription">Créer un compte</Link>
              <Link className="btn btn-secondary btn-lg" to="/services">Voir nos services</Link>
            </div>
          </div>
          <div className="hero__visual">
            <IllPhone />
          </div>
        </div>
      </section>

      <section className="section container" aria-labelledby="probleme-title">
        <div className="band">
          <h2 id="probleme-title">Le problème : on attend sans savoir.</h2>
          <p>
            Une fois la demande déposée, personne ne sait{' '}
            <strong className="hl">qui la détient, ce qui manque, ni quand le document sera prêt</strong>.
            Beaucoup de familles se déplacent pour rien, alors qu&apos;une date limite approche.
          </p>
        </div>
      </section>

      <section className="section container" aria-labelledby="etapes-title">
        <h2 id="etapes-title" className="section__title">Quatre étapes, un seul interlocuteur.</h2>
        <ol className="grid-auto steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="card-site">
              <span className="step-num" aria-hidden="true">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section container" aria-labelledby="images-title">
        <h2 id="images-title" className="section__title">Ce que nous faisons pour vous.</h2>
        <div className="grid-auto grid-auto--wide">
          {FIGURES.map(({ Img, title, text }) => (
            <figure key={title} className="figure">
              <div className="figure__img"><Img /></div>
              <figcaption><strong>{title}</strong><p>{text}</p></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="cta">
          <div>
            <h2>Prêt à ne plus attendre sans savoir ?</h2>
            <p>
              Suivi de votre document : <span className="mark">{formatXof(FRAIS_SUIVI_XOF)}</span>, payés au
              dépôt de la demande.
            </p>
          </div>
          <Link className="btn btn-orange btn-lg" to="/inscription">Créer un compte</Link>
        </div>
      </section>
    </>
  )
}
