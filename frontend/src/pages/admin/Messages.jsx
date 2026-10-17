import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Loader from '@/components/ui/Loader'
import Notice from '@/components/ui/Notice'
import PageHeader from '@/components/ui/PageHeader'
import WidgetCard from '@/components/ui/WidgetCard'
import { listerMessages, marquerMessage } from '@/features/site/site.api'
import { useFetch } from '@/hooks/useFetch'
import { messageErreur } from '@/services/api'
import { formatDateHeure } from '@/utils/format'

/** Rend le moyen de réponse cliquable : e-mail, ou numéro (appel + WhatsApp). */
function ContactLien({ valeur }) {
  const v = valeur.trim()
  if (v.includes('@')) return <a href={`mailto:${v}`}>{v}</a>
  if (/^\+?[0-9 ()-]{8,}$/.test(v)) {
    const chiffres = v.replace(/\D/g, '')
    return (
      <span>
        <a href={`tel:+${chiffres}`}>{v}</a> ·{' '}
        <a href={`https://wa.me/${chiffres}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </span>
    )
  }
  return <span>{v}</span>
}

export default function Messages() {
  const { data, loading, error, reload } = useFetch(listerMessages)
  const [erreur, setErreur] = useState('')
  const [occupe, setOccupe] = useState('')

  async function basculer(m) {
    setOccupe(m.id)
    setErreur('')
    try {
      await marquerMessage(m.id, !m.lu)
      await reload(true)
    } catch (err) {
      setErreur(messageErreur(err))
    } finally {
      setOccupe('')
    }
  }

  const nonLus = data ? data.filter((m) => !m.lu).length : 0

  return (
    <div className="dashboard-layout">
      <PageHeader
        title="Messages"
        description={data ? `${nonLus} message${nonLus > 1 ? 's' : ''} non lu${nonLus > 1 ? 's' : ''} sur ${data.length}.` : 'Messages envoyés depuis la page Contact.'}
      />
      {loading && <Loader />}
      <Notice>{error || erreur}</Notice>
      {data && data.length === 0 && (
        <WidgetCard title="Boîte vide"><p className="hint">Aucun message pour le moment.</p></WidgetCard>
      )}
      {data && data.length > 0 && (
        <ul className="msg-list">
          {data.map((m) => (
            <li key={m.id} className={`msg-item ${m.lu ? '' : 'msg-item--new'}`}>
              <div className="msg-item__head">
                <strong>{m.nom}</strong>
                {!m.lu && <Badge tone="warn">Nouveau</Badge>}
                <span className="hint msg-item__date">{formatDateHeure(m.createdAt)}</span>
              </div>
              <p className="msg-item__subject">{m.sujet}</p>
              <p className="msg-item__body">{m.message}</p>
              <div className="msg-item__foot">
                <span>Répondre à : <ContactLien valeur={m.contact} /></span>
                <Button variant="secondary" className="btn-sm" loading={occupe === m.id} onClick={() => basculer(m)}>
                  {m.lu ? 'Marquer non lu' : 'Marquer comme lu'}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
