export const formatXof = (n) =>
  n == null ? '—' : `${Number(n).toLocaleString('fr-FR')} F CFA`

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

export const formatDateHeure = (d) =>
  d
    ? new Date(d).toLocaleString('fr-FR', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
      })
    : '—'
