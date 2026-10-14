export const NAV_FAMILLE = [
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: 'dashboard',
    children: [
      { to: '/famille', label: 'Mes demandes', end: true },
      { to: '/famille/nouvelle', label: 'Nouvelle demande' },
    ],
  },
  { to: '/tarifs', label: 'Tarifs', icon: 'account' },
]

export const NAV_ADMIN = [
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: 'dashboard',
    children: [
      { to: '/admin', label: 'Vue générale', end: true },
      { to: '/admin/statistiques', label: 'Statistiques' },
    ],
  },
  { to: '/admin/demandes', label: 'Demandes', icon: 'exam' },
  { to: '/admin/etablissements', label: 'Établissements', icon: 'class' },
  { to: '/admin/demandes?statut=PIECE_MANQUANTE', label: 'Avis', icon: 'notice' },
]

export const BREADCRUMBS = {
  '/': [{ label: 'Accueil' }],
  '/tarifs': [{ label: 'Accueil', to: '/' }, { label: 'Tarifs' }],
  '/connexion': [{ label: 'Accueil', to: '/' }, { label: 'Connexion' }],
  '/inscription': [{ label: 'Accueil', to: '/' }, { label: 'Inscription' }],
  '/famille': [{ label: 'Accueil', to: '/' }, { label: 'Famille' }, { label: 'Mes demandes' }],
  '/famille/nouvelle': [{ label: 'Accueil', to: '/' }, { label: 'Famille' }, { label: 'Nouvelle demande' }],
  '/admin': [{ label: 'Accueil', to: '/' }, { label: 'Administration' }, { label: 'Vue générale' }],
  '/admin/demandes': [{ label: 'Accueil', to: '/' }, { label: 'Administration' }, { label: 'Demandes' }],
  '/admin/etablissements': [{ label: 'Accueil', to: '/' }, { label: 'Administration' }, { label: 'Établissements' }],
  '/admin/statistiques': [{ label: 'Accueil', to: '/' }, { label: 'Administration' }, { label: 'Statistiques' }],
}

export function breadcrumbsForPath(pathname) {
  if (BREADCRUMBS[pathname]) return BREADCRUMBS[pathname]
  if (pathname.startsWith('/famille/demandes/') && pathname.endsWith('/paiement')) {
    return [
      { label: 'Accueil', to: '/' },
      { label: 'Famille', to: '/famille' },
      { label: 'Paiement' },
    ]
  }
  if (pathname.startsWith('/famille/demandes/')) {
    return [
      { label: 'Accueil', to: '/' },
      { label: 'Famille', to: '/famille' },
      { label: 'Détail demande' },
    ]
  }
  if (pathname.startsWith('/admin/demandes/')) {
    return [
      { label: 'Accueil', to: '/' },
      { label: 'Administration', to: '/admin' },
      { label: 'Détail demande' },
    ]
  }
  return [{ label: 'Accueil', to: '/' }, { label: 'Page' }]
}
