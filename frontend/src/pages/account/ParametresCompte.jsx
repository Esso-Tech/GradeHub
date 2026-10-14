import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Notice from '@/components/ui/Notice'
import PageHeader from '@/components/ui/PageHeader'
import WidgetCard from '@/components/ui/WidgetCard'
import { useAuth } from '@/hooks/useAuth'
import { messageErreur } from '@/services/api'

export default function ParametresCompte({ peutSupprimerCompte = false }) {
  const { user, supprimerCompte, mettreAJourProfil } = useAuth()
  const navigate = useNavigate()

  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [profilErreur, setProfilErreur] = useState('')
  const [profilSucces, setProfilSucces] = useState('')
  const [profilLoading, setProfilLoading] = useState(false)

  const [motDePasse, setMotDePasse] = useState('')
  const [confirme, setConfirme] = useState(false)
  const [supprErreur, setSupprErreur] = useState('')
  const [supprLoading, setSupprLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    setNom(user.nom ?? '')
    setEmail(user.email ?? '')
    setTelephone(user.telephone ?? '')
  }, [user])

  async function onEnregistrerProfil(e) {
    e.preventDefault()
    setProfilErreur('')
    setProfilSucces('')
    setProfilLoading(true)
    try {
      await mettreAJourProfil({ nom: nom.trim(), email: email.trim(), telephone: telephone.trim() })
      setProfilSucces('Vos informations ont été enregistrées.')
    } catch (err) {
      setProfilErreur(messageErreur(err))
    } finally {
      setProfilLoading(false)
    }
  }

  async function onSupprimer(e) {
    e.preventDefault()
    if (!peutSupprimerCompte) return
    setSupprErreur('')
    setSupprLoading(true)
    try {
      await supprimerCompte(motDePasse)
      navigate('/', { replace: true })
    } catch (err) {
      setSupprErreur(messageErreur(err))
      setSupprLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Paramètres du compte"
        description="Modifiez vos informations et gérez la sécurité de votre espace."
      />

      <WidgetCard
        title="Informations personnelles"
        description="Ces coordonnées sont utilisées pour vos demandes et nos échanges."
        className="settings-block"
      >
        <form onSubmit={onEnregistrerProfil} className="form">
          {profilSucces && <Notice tone="success">{profilSucces}</Notice>}
          {profilErreur && <Notice tone="error">{profilErreur}</Notice>}
          <Field label="Nom complet">
            {(id) => (
              <input
                id={id}
                className="input"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
            )}
          </Field>
          <Field label="E-mail">
            {(id) => (
              <input
                id={id}
                className="input"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
          </Field>
          <Field label="Téléphone">
            {(id) => (
              <input
                id={id}
                className="input"
                type="tel"
                autoComplete="tel"
                required
                placeholder="+228 90 00 00 00"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
            )}
          </Field>
          <div className="form-row">
            <Button type="submit" loading={profilLoading}>
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </WidgetCard>

      {peutSupprimerCompte ? (
        <WidgetCard
          title="Supprimer le compte"
          description="Cette action est définitive. Vos demandes clôturées ou annulées seront effacées."
          className="settings-block settings-block--danger"
        >
          <form onSubmit={onSupprimer} className="form">
            <Notice tone="info">
              Vous ne pourrez pas supprimer votre compte tant qu&apos;une demande est encore en cours de
              traitement.
            </Notice>
            {supprErreur && <Notice tone="error">{supprErreur}</Notice>}
            <Field label="Mot de passe actuel">
              {(id) => (
                <input
                  id={id}
                  className="input"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                />
              )}
            </Field>
            <label className="settings-check">
              <input
                type="checkbox"
                checked={confirme}
                onChange={(e) => setConfirme(e.target.checked)}
              />
              <span>Je comprends que la suppression de mon compte est irréversible.</span>
            </label>
            <div className="form-row">
              <Button
                type="submit"
                variant="danger"
                loading={supprLoading}
                disabled={!confirme || !motDePasse}
              >
                Supprimer définitivement mon compte
              </Button>
            </div>
          </form>
        </WidgetCard>
      ) : (
        <WidgetCard title="Suppression du compte" className="settings-block">
          <p className="settings-muted">
            Les comptes administrateur ne peuvent pas être supprimés depuis cette interface. Contactez
            l&apos;équipe technique si nécessaire.
          </p>
        </WidgetCard>
      )}
    </>
  )
}
