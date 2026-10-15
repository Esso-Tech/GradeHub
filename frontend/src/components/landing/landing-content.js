export const LANDING_TRUST = [
  { value: '1 500 XOF', label: 'Frais de suivi par document' },
  { value: 'SMS & WhatsApp', label: 'Alertes à chaque étape' },
  { value: 'Scan + original', label: 'Numérique puis remise en main propre' },
]

export const LANDING_DOCUMENTS = [
  {
    icon: 'folder',
    title: 'CEPD',
    text: 'Certificat d\'études du premier degré. Nous suivons la demande auprès de l\'établissement concerné.',
  },
  {
    icon: 'document',
    title: 'BEPC',
    text: 'Brevet des collèges. Dépôt guidé en ligne, puis suivi jusqu\'à la signature du document.',
  },
  {
    icon: 'clipboard',
    title: 'Relevés de notes',
    text: 'Seconde à Terminale. Idéal quand vous avez besoin d\'une copie certifiée sans multiplier les visites.',
  },
]

export const LANDING_STEPS = [
  {
    num: '1',
    title: 'Créez votre demande',
    text: 'Établissement, type de document et coordonnées : le formulaire vous guide pas à pas.',
  },
  {
    num: '2',
    title: 'Réglez les frais de suivi',
    text: 'Paiement sécurisé par mobile money. Confirmation immédiate dans votre espace famille.',
  },
  {
    num: '3',
    title: 'Suivez l\'avancement',
    text: 'Statut en ligne, journal de bord et alertes SMS ou WhatsApp aux étapes clés.',
  },
  {
    num: '4',
    title: 'Recevez votre document',
    text: 'Scan dès la signature à l\'établissement, puis remise de l\'original en main propre.',
  },
]

export const LANDING_BENEFITS = [
  {
    title: 'Moins de déplacements',
    text: 'Une seule prise de contact avec GRADE HUB au lieu de relancer le secrétariat chaque semaine.',
  },
  {
    title: 'Visibilité en temps réel',
    text: 'Vous savez où en est le dossier, avec un historique clair des actions effectuées.',
  },
  {
    title: 'Équipe locale à Lomé',
    text: 'Relances et suivi physique auprès des établissements par une équipe dédiée.',
  },
]

export const LANDING_FAQ = [
  {
    q: 'Quels documents puis-je demander ?',
    a: 'CEPD, BEPC et relevés de notes de la Seconde à la Terminale. D\'autres types pourront s\'ajouter progressivement.',
  },
  {
    q: 'Combien coûte le service ?',
    a: 'Les frais de suivi sont de 1 500 XOF par document, payés au dépôt de la demande. L\'envoi de l\'original est facturé en plus, au coût réel. Voir la page Tarifs pour le détail.',
  },
  {
    q: 'Quels sont les délais ?',
    a: 'Ils dépendent de l\'établissement et du type de document. Les pièces de plus de deux ans peuvent prendre 50 % de temps en plus. Une formule express sera proposée ultérieurement.',
  },
  {
    q: 'Comment recevoir l\'original ?',
    a: 'Après le scan disponible dans votre espace, l\'original vous est remis en main propre selon le mode convenu (retrait ou envoi facturé au coût réel).',
  },
  {
    q: 'Dois-je créer un compte ?',
    a: 'Oui, un compte famille permet de déposer la demande, payer et suivre chaque dossier depuis un seul tableau de bord.',
  },
]

export const LANDING_PREVIEW = {
  ref: 'GH-2026-0042',
  label: 'BEPC · Lycée',
  status: 'En cours de traitement',
  progress: 62,
  steps: [
    { label: 'Paiement confirmé', state: 'done' },
    { label: 'Déposée à l\'établissement', state: 'done' },
    { label: 'En cours de traitement', state: 'active' },
    { label: 'Scan puis original', state: 'pending' },
  ],
}
