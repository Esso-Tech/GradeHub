import { useState } from 'react'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Notice from '@/components/ui/Notice'
import { IllSchool } from '@/components/illustrations'
import { IconClock, IconMail, IconPhone, IconPin, IconWhatsApp } from '@/components/ui/SiteIcons'
import { SITE_BASE, mailLink, telLink, whatsappLink } from '@/config/site'
import { envoyerMessage } from '@/features/site/site.api'
import { useSite } from '@/hooks/useSite'
import { messageErreur } from '@/services/api'

const SUJETS = [
  'Une demande de document',
  'Suivre une demande en cours',
  'Un paiement',
  'Un établissement partenaire',
  'Autre',
]
const VIDE = { nom: '', contact: '', sujet: SUJETS[0], message: '', website: '' }

function Info({ icon: Icon, titre, children }) {
  return (
    <div className="info-item">
      <span className="info-item__icon"><Icon size={20} /></span>
      <div><strong>{titre}</strong><div>{children}</div></div>
    </div>
  )
}

export default function Contact() {
  const { contact } = useSite()
  const [form, setForm] = useState(VIDE)
  const [etat, setEtat] = useState({ envoi: false, ok: false, erreur: '' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function onSubmit(e) {
    e.preventDefault()
    setEtat({ envoi: true, ok: false, erreur: '' })
    try {
      await envoyerMessage(form)
      setForm(VIDE)
      setEtat({ envoi: false, ok: true, erreur: '' })
    } catch (err) {
      setEtat({ envoi: false, ok: false, erreur: messageErreur(err) })
    }
  }

  const wa = whatsappLink(contact, 'Bonjour GRADE HUB, ')

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="kicker">Contact</p>
          <h1>Une question ? Écrivez-nous.</h1>
          <p className="lead">
            Pour une demande en cours, indiquez votre <strong className="hl">référence</strong>. Nous
            répondons par WhatsApp ou par e-mail.
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="contact-grid">
          <form className="surface contact-form form" onSubmit={onSubmit}>
            <h2>Envoyer un message</h2>
            <Field label="Nom et prénom">
              {(id) => <input id={id} className="input" required minLength={2} maxLength={100} autoComplete="name"
                value={form.nom} onChange={(e) => set('nom', e.target.value)} />}
            </Field>
            <Field label="E-mail ou téléphone" hint="Pour vous répondre.">
              {(id) => <input id={id} className="input" required minLength={3} maxLength={150}
                value={form.contact} onChange={(e) => set('contact', e.target.value)} />}
            </Field>
            <Field label="Sujet">
              {(id) => (
                <select id={id} className="input" value={form.sujet} onChange={(e) => set('sujet', e.target.value)}>
                  {SUJETS.map((s) => <option key={s}>{s}</option>)}
                </select>
              )}
            </Field>
            <Field label="Message">
              {(id) => <textarea id={id} className="input" rows={5} required minLength={5} maxLength={2000}
                value={form.message} onChange={(e) => set('message', e.target.value)} />}
            </Field>
            {/* Champ piège contre les robots : invisible, ne pas remplir */}
            <div className="hp" aria-hidden="true">
              <label>Ne pas remplir
                <input tabIndex={-1} autoComplete="off" value={form.website}
                  onChange={(e) => set('website', e.target.value)} />
              </label>
            </div>
            <Notice>{etat.erreur}</Notice>
            <Notice tone="success">{etat.ok ? 'Merci, votre message est envoyé. Nous vous répondons rapidement.' : ''}</Notice>
            <Button type="submit" loading={etat.envoi}>Envoyer le message</Button>
          </form>

          <aside className="contact-aside" aria-label="Nos coordonnées">
            <h2>Nos coordonnées</h2>
            {contact.phone && <Info icon={IconPhone} titre="Téléphone"><a href={telLink(contact)}>{contact.phone}</a></Info>}
            {contact.whatsapp && <Info icon={IconWhatsApp} titre="WhatsApp"><a href={wa}>{contact.whatsapp}</a></Info>}
            {contact.email && <Info icon={IconMail} titre="E-mail"><a href={mailLink(contact)}>{contact.email}</a></Info>}
            <Info icon={IconPin} titre="Adresse">
              {contact.address ? `${contact.address}, ${SITE_BASE.city}` : SITE_BASE.city}
            </Info>
            {contact.hours && <Info icon={IconClock} titre="Horaires">{contact.hours}</Info>}
            {wa && <a className="btn btn-secondary" href={wa} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a>}
            <div className="figure__img"><IllSchool /></div>
          </aside>
        </div>
      </section>
    </>
  )
}
