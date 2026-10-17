import { Link } from 'react-router-dom'
import { IllDoc } from '@/components/illustrations'
import { useSite } from '@/hooks/useSite'
import { FRAIS_SUIVI_XOF } from '@/utils/constants'
import { formatXof } from '@/utils/format'

/** Une carte de service. « important » met l'étiquette en orange. */
function ServiceCard({ service }) {
  return (
    <article className="card-site">
      <h3>{service.titre}</h3>
      <p>{service.texte}</p>
      {service.etiquette && <span className={`tag ${service.important ? 'tag--orange' : ''}`}>{service.etiquette}</span>}
    </article>
  )
}

export default function Services() {
  const { services } = useSite()
  const { documents, inclus } = services

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="kicker">Nos services</p>
          <h1>Du dépôt de la demande à l&apos;original, tout est suivi.</h1>
          <p className="lead">
            Pour l&apos;instant, nous traitons les documents des établissements publics de Lomé. Les
            établissements privés suivront progressivement.
          </p>
        </div>
      </section>

      {documents.length > 0 && (
        <section className="section container" aria-labelledby="docs-title">
          <h2 id="docs-title" className="section__title">Les documents que nous suivons</h2>
          <div className="grid-auto">
            {documents.map((d) => <ServiceCard key={d.titre} service={d} />)}
          </div>
        </section>
      )}

      {inclus.length > 0 && (
        <section className="section container" aria-labelledby="inclus-title">
          <h2 id="inclus-title" className="section__title">Ce qui est inclus</h2>
          <div className="grid-auto">
            {inclus.map((s) => <ServiceCard key={s.titre} service={s} />)}
          </div>
        </section>
      )}

      <section className="section container">
        <div className="split">
          <div className="figure__img"><IllDoc /></div>
          <div>
            <p className="kicker">Votre mandat</p>
            <h2 className="section__title">Nous agissons avec votre accord, jamais sans.</h2>
            <p className="lead">
              Vos documents sont nominatifs. Avant tout dépôt, vous nous donnez un{' '}
              <strong className="hl">mandat écrit</strong>. Le scan n&apos;est transmis qu&apos;à vous.
            </p>
          </div>
        </div>
      </section>

      <section id="tarifs" className="section container" aria-labelledby="tarifs-title">
        <h2 id="tarifs-title" className="section__title">Tarifs</h2>
        <div className="grid-auto">
          <article className="card-site price-card price-card--featured">
            <h3>Suivi</h3>
            <p className="price-card__value">{formatXof(FRAIS_SUIVI_XOF)}</p>
            <p>Par document, payés au dépôt de la demande par T-Money ou Flooz.</p>
          </article>
          <article className="card-site price-card">
            <h3>Envoi de l&apos;original</h3>
            <p className="price-card__value price-card__value--small">Au coût réel</p>
            <p>Facturé en plus, selon l&apos;adresse.</p>
          </article>
          <article className="card-site price-card">
            <h3>Express</h3>
            <p className="price-card__value price-card__value--small">Bientôt</p>
            <p>Le prix sera communiqué prochainement.</p>
          </article>
        </div>
      </section>

      <section className="section container">
        <div className="cta">
          <h2>Faites votre première demande.</h2>
          <Link className="btn btn-orange btn-lg" to="/inscription">Créer un compte</Link>
        </div>
      </section>
    </>
  )
}
