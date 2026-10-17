import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Notice from '@/components/ui/Notice'
import PageHeader from '@/components/ui/PageHeader'
import WidgetCard from '@/components/ui/WidgetCard'
import { enregistrerContact, enregistrerServices } from '@/features/site/site.api'
import { useSite } from '@/hooks/useSite'
import { messageErreur } from '@/services/api'

/** Exécute un enregistrement et expose son état (occupé / ok / erreur). */
function useEnregistrement(fn, onDone) {
  const [etat, setEtat] = useState({ occupe: false, ok: false, erreur: '' })
  const lancer = async () => {
    setEtat({ occupe: true, ok: false, erreur: '' })
    try {
      await fn()
      await onDone()
      setEtat({ occupe: false, ok: true, erreur: '' })
    } catch (err) {
      setEtat({ occupe: false, ok: false, erreur: messageErreur(err) })
    }
  }
  return [etat, lancer]
}

/* ---------- Coordonnées ---------- */
function EditeurContact() {
  const { contact, reload } = useSite()
  const [form, setForm] = useState(contact)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const [etat, enregistrer] = useEnregistrement(() => enregistrerContact(form), reload)

  return (
    <WidgetCard
      title="Coordonnées"
      description="Affichées dans le pied de page et sur la page Contact. Un champ laissé vide n'est pas affiché."
    >
      <form className="form" onSubmit={(e) => { e.preventDefault(); enregistrer() }}>
        <div className="svc-edit__row">
          <Field label="Téléphone">
            {(id) => <input id={id} className="input" type="tel" maxLength={30} placeholder="+228 90 00 00 00"
              value={form.phone} onChange={(e) => set('phone', e.target.value)} />}
          </Field>
          <Field label="WhatsApp" hint="Active le bouton « Écrire sur WhatsApp ».">
            {(id) => <input id={id} className="input" type="tel" maxLength={30} placeholder="+228 90 00 00 00"
              value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} />}
          </Field>
          <Field label="E-mail" hint="Reçoit aussi une alerte à chaque nouveau message (si l'envoi d'e-mails est configuré).">
            {(id) => <input id={id} className="input" type="email" maxLength={120}
              value={form.email} onChange={(e) => set('email', e.target.value)} />}
          </Field>
        </div>
        <Field label="Adresse (quartier, repère)" hint="« Lomé, Togo » est ajouté automatiquement.">
          {(id) => <input id={id} className="input" maxLength={200}
            value={form.address} onChange={(e) => set('address', e.target.value)} />}
        </Field>
        <Field label="Horaires d'accueil">
          {(id) => <input id={id} className="input" maxLength={150} placeholder="Lundi au vendredi, 8 h à 17 h"
            value={form.hours} onChange={(e) => set('hours', e.target.value)} />}
        </Field>
        <Notice>{etat.erreur}</Notice>
        <Notice tone="success">{etat.ok ? 'Coordonnées enregistrées. Elles sont visibles sur le site.' : ''}</Notice>
        <div><Button type="submit" loading={etat.occupe}>Enregistrer les coordonnées</Button></div>
      </form>
    </WidgetCard>
  )
}

/* ---------- Services ---------- */
function ListeServices({ titre, description, items, onChange, nextKey }) {
  const maj = (i, patch) => onChange(items.map((it, k) => (k === i ? { ...it, ...patch } : it)))
  const retirer = (i) => onChange(items.filter((_, k) => k !== i))
  const deplacer = (i, d) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const copie = [...items]
    ;[copie[i], copie[j]] = [copie[j], copie[i]]
    onChange(copie)
  }
  const ajouter = () =>
    onChange([...items, { _k: nextKey(), titre: '', texte: '', etiquette: '', important: false }])

  return (
    <WidgetCard title={titre} description={description}>
      {items.length === 0 && <p className="hint">Aucune carte : cette section est masquée sur le site.</p>}
      <ul className="svc-edit">
        {items.map((it, i) => (
          <li key={it._k} className="svc-edit__item">
            <div className="svc-edit__row">
              <Field label="Titre">
                {(id) => <input id={id} className="input" required maxLength={80}
                  value={it.titre} onChange={(e) => maj(i, { titre: e.target.value })} />}
              </Field>
              <Field label="Étiquette (facultatif)" hint="Petit repère sous le texte.">
                {(id) => <input id={id} className="input" maxLength={40}
                  value={it.etiquette} onChange={(e) => maj(i, { etiquette: e.target.value })} />}
              </Field>
            </div>
            <Field label="Description">
              {(id) => <textarea id={id} className="input" rows={2} required maxLength={300}
                value={it.texte} onChange={(e) => maj(i, { texte: e.target.value })} />}
            </Field>
            <div className="svc-edit__actions">
              <label className="check">
                <input type="checkbox" checked={it.important}
                  onChange={(e) => maj(i, { important: e.target.checked })} />
                <span>Mettre l&apos;étiquette en évidence (orange)</span>
              </label>
              <span className="svc-edit__spacer" />
              <Button variant="secondary" className="btn-sm" disabled={i === 0} onClick={() => deplacer(i, -1)}
                aria-label={`Monter « ${it.titre || 'carte'} »`}>Monter</Button>
              <Button variant="secondary" className="btn-sm" disabled={i === items.length - 1} onClick={() => deplacer(i, 1)}
                aria-label={`Descendre « ${it.titre || 'carte'} »`}>Descendre</Button>
              <Button variant="danger" className="btn-sm" onClick={() => retirer(i)}
                aria-label={`Supprimer « ${it.titre || 'carte'} »`}>Supprimer</Button>
            </div>
          </li>
        ))}
      </ul>
      {items.length < 12 && (
        <div className="svc-edit__add"><Button variant="secondary" onClick={ajouter}>Ajouter une carte</Button></div>
      )}
    </WidgetCard>
  )
}

function EditeurServices() {
  const { services, reload } = useSite()
  const compteur = useRef(0)
  const nextKey = () => `n${++compteur.current}`
  const avecCle = (liste) => liste.map((s) => ({ ...s, _k: nextKey() }))
  const [documents, setDocuments] = useState(() => avecCle(services.documents))
  const [inclus, setInclus] = useState(() => avecCle(services.inclus))

  const nettoyer = (liste) => liste.map(({ _k, ...s }) => ({ ...s, titre: s.titre.trim(), texte: s.texte.trim(), etiquette: s.etiquette.trim() }))
  const [etat, enregistrer] = useEnregistrement(
    () => enregistrerServices({ documents: nettoyer(documents), inclus: nettoyer(inclus) }),
    reload,
  )

  return (
    <form onSubmit={(e) => { e.preventDefault(); enregistrer() }} className="svc-forms">
      <ListeServices
        titre="Documents suivis"
        description="Une carte par document (CEPD, BEPC, relevés…). Section « Les documents que nous suivons »."
        items={documents} onChange={setDocuments} nextKey={nextKey}
      />
      <ListeServices
        titre="Ce qui est inclus"
        description="Les prestations : suivi, scan, envoi, délais particuliers… Section « Ce qui est inclus »."
        items={inclus} onChange={setInclus} nextKey={nextKey}
      />
      <Notice>{etat.erreur}</Notice>
      <Notice tone="success">{etat.ok ? 'Services enregistrés. Ils sont visibles sur le site.' : ''}</Notice>
      <div className="svc-edit__save">
        <Button type="submit" loading={etat.occupe}>Enregistrer les services</Button>
        <Link to="/services" target="_blank" rel="noopener noreferrer">Voir la page Services</Link>
      </div>
    </form>
  )
}

export default function ContenuSite() {
  return (
    <div className="dashboard-layout">
      <PageHeader
        title="Contenu du site"
        description="Remplissez les pages Services et Contact. Les changements sont visibles par les visiteurs dès l'enregistrement."
      />
      <EditeurContact />
      <EditeurServices />
    </div>
  )
}
