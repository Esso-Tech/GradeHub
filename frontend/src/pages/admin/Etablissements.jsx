import { useState } from 'react'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Loader from '@/components/ui/Loader'
import Notice from '@/components/ui/Notice'
import Badge from '@/components/ui/Badge'
import PageHeader from '@/components/ui/PageHeader'
import Select from '@/components/ui/Select'
import WidgetCard from '@/components/ui/WidgetCard'
import { useFetch } from '@/hooks/useFetch'
import { listerEtablissements } from '@/features/etablissements/etablissements.api'
import { creerEtablissement, definirDelai } from '@/features/admin/admin.api'
import { messageErreur } from '@/services/api'

function LigneDelai({ etab, onSaved, onError }) {
  const [valeur, setValeur] = useState(etab.delaiMesureJours ?? '')
  const [occupe, setOccupe] = useState(false)

  async function enregistrer() {
    setOccupe(true)
    try {
      await definirDelai(etab.id, valeur === '' ? null : Number(valeur))
      onSaved()
    } catch (err) {
      onError(messageErreur(err))
    } finally {
      setOccupe(false)
    }
  }

  return (
    <li>
      <div>
        <strong>{etab.nom}</strong>{' '}
        <Badge tone={etab.type === 'PUBLIC' ? 'info' : 'muted'}>{etab.type === 'PUBLIC' ? 'Public' : 'Privé'}</Badge>{' '}
        {etab.accordCadreSigne && <Badge tone="ok">Accord signé</Badge>}
      </div>
      <div className="inline">
        <label htmlFor={`delai-${etab.id}`}>Délai mesuré (jours)</label>
        <input id={`delai-${etab.id}`} className="input input-small" type="number" min="1"
          value={valeur} onChange={(e) => setValeur(e.target.value)} placeholder="non mesuré" />
        <Button variant="secondary" loading={occupe} onClick={enregistrer}>Enregistrer</Button>
      </div>
    </li>
  )
}

export default function Etablissements() {
  const { data, loading, error, reload } = useFetch(listerEtablissements)
  const [erreur, setErreur] = useState('')
  const [form, setForm] = useState({ nom: '', type: 'PUBLIC', accordCadreSigne: false })
  const [occupe, setOccupe] = useState(false)

  async function ajouter(e) {
    e.preventDefault()
    setOccupe(true)
    setErreur('')
    try {
      await creerEtablissement(form)
      setForm({ nom: '', type: 'PUBLIC', accordCadreSigne: false })
      await reload(true)
    } catch (err) {
      setErreur(messageErreur(err))
    } finally {
      setOccupe(false)
    }
  }

  return (
    <div className="dashboard-layout">
      <PageHeader
        title="Établissements"
        description="Délais mesurés et partenaires. Sans délai mesuré, aucune promesse n'est faite aux familles."
      />
      {loading && <Loader />}
      <Notice>{error || erreur}</Notice>
      {data && (
        <WidgetCard title="Liste des établissements">
          <ul className="list list-stack">
            {data.map((e) => (
              <LigneDelai key={`${e.id}-${e.delaiMesureJours}`} etab={e}
                onSaved={() => reload(true)} onError={setErreur} />
            ))}
          </ul>
        </WidgetCard>
      )}

      <WidgetCard title="Ajouter un établissement">
      <form className="form" onSubmit={ajouter}>
        <Field label="Nom">
          {(id) => <input id={id} className="input" required minLength={2} value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })} />}
        </Field>
        <Field label="Type">
          {(id) => (
            <Select id={id} value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="PUBLIC">Public</option>
              <option value="PRIVE">Privé</option>
            </Select>
          )}
        </Field>
        <label className="check">
          <input type="checkbox" checked={form.accordCadreSigne}
            onChange={(e) => setForm({ ...form, accordCadreSigne: e.target.checked })} />
          <span>Accord écrit signé</span>
        </label>
        <Button type="submit" loading={occupe}>Ajouter</Button>
      </form>
      </WidgetCard>
    </div>
  )
}
