export default function WidgetCard({ title, description, actions, children, className = '' }) {
  return (
    <section className={`widget-card ${className}`.trim()}>
      <header className="widget-card__header">
        <div>
          <h2 className="widget-card__title">{title}</h2>
          {description && <p className="widget-card__desc">{description}</p>}
        </div>
        {actions && <div className="widget-card__actions">{actions}</div>}
      </header>
      <div className="widget-card__body">{children}</div>
    </section>
  )
}
