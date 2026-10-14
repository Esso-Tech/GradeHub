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
  { to: '/famille/tarifs', label: 'Tarifs', icon: 'account' },
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

const CRUMBS_PUBLIC = {
  '/': [{ label: 'Accueil' }],
  '/tarifs': [{ label: 'Accueil', to: '/' }, { label: 'Tarifs' }],
  '/connexion': [{ label: 'Accueil', to: '/' }, { label: 'Connexion' }],
  '/inscription': [{ label: 'Accueil', to: '/' }, { label: 'Inscription' }],
}

const CRUMBS_FAMILLE = {
  '/famille': [{ label: 'Famille' }, { label: 'Mes demandes' }],
  '/famille/nouvelle': [{ label: 'Famille', to: '/famille' }, { label: 'Nouvelle demande' }],
  '/famille/tarifs': [{ label: 'Famille', to: '/famille' }, { label: 'Tarifs' }],
  '/famille/parametres': [{ label: 'Famille', to: '/famille' }, { label: 'Paramètres du compte' }],
}

const CRUMBS_ADMIN = {
  '/admin': [{ label: 'Administration' }, { label: 'Vue générale' }],
  '/admin/demandes': [{ label: 'Administration', to: '/admin' }, { label: 'Demandes' }],
  '/admin/etablissements': [{ label: 'Administration', to: '/admin' }, { label: 'Établissements' }],
  '/admin/statistiques': [{ label: 'Administration', to: '/admin' }, { label: 'Statistiques' }],
  '/admin/parametres': [{ label: 'Administration', to: '/admin' }, { label: 'Paramètres du compte' }],
}

export function breadcrumbsForPath(pathname, variant = 'public') {
  const map =
    variant === 'admin' ? CRUMBS_ADMIN : variant === 'famille' ? CRUMBS_FAMILLE : CRUMBS_PUBLIC
  if (map[pathname]) return map[pathname]

  if (pathname.startsWith('/famille/demandes/') && pathname.endsWith('/paiement')) {
    return [{ label: 'Famille', to: '/famille' }, { label: 'Paiement' }]
  }
  if (pathname.startsWith('/famille/demandes/')) {
    return [{ label: 'Famille', to: '/famille' }, { label: 'Détail demande' }]
  }
  if (pathname.startsWith('/admin/demandes/')) {
    return [{ label: 'Administration', to: '/admin' }, { label: 'Détail demande' }]
  }
  return variant === 'admin'
    ? [{ label: 'Administration', to: '/admin' }, { label: 'Page' }]
    : [{ label: 'Famille', to: '/famille' }, { label: 'Page' }]
}
