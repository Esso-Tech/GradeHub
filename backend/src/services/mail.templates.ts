/** Gabarits d'e-mail. Fonctions pures : testables sans serveur SMTP. */

export function echapperHtml(texte: string): string {
  return texte
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export interface MessageContactMail {
  nom: string
  contact: string
  sujet: string
  message: string
  createdAt: Date
}

const EMAIL_SIMPLE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Si le visiteur a laissé un e-mail, « Répondre » écrit directement à lui. */
export function emailDeReponse(contact: string): string | undefined {
  const c = contact.trim()
  return EMAIL_SIMPLE.test(c) ? c : undefined
}

export function construireEmailNouveauMessage(m: MessageContactMail, lienAdmin: string) {
  const date = m.createdAt.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Africa/Lome' })
  const sujet = `[GRADE HUB] Nouveau message : ${m.sujet}`.replace(/[\r\n]+/g, ' ')

  const text = [
    'Nouveau message reçu depuis la page Contact.',
    '',
    `De : ${m.nom}`,
    `Pour répondre : ${m.contact}`,
    `Sujet : ${m.sujet}`,
    `Reçu le : ${date}`,
    '',
    m.message,
    '',
    `Voir et gérer les messages : ${lienAdmin}`,
  ].join('\n')

  const html = `<!doctype html>
<html lang="fr"><body style="margin:0;background:#f1f6ee;font-family:Arial,Helvetica,sans-serif;color:#1b1f1a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden">
<tr><td style="background:#2f6f1f;color:#ffffff;padding:18px 24px;font-size:18px;font-weight:bold">GRADE HUB · Nouveau message</td></tr>
<tr><td style="padding:24px">
<p style="margin:0 0 4px;font-size:13px;color:#55604f">${echapperHtml(date)}</p>
<h1 style="margin:0 0 16px;font-size:20px">${echapperHtml(m.sujet)}</h1>
<p style="margin:0 0 4px"><strong>${echapperHtml(m.nom)}</strong></p>
<p style="margin:0 0 16px;color:#55604f">Pour répondre : ${echapperHtml(m.contact)}</p>
<div style="border-left:4px solid #f28c28;background:#fff1df;padding:12px 16px;border-radius:4px;white-space:pre-wrap">${echapperHtml(m.message)}</div>
<p style="margin:24px 0 0"><a href="${echapperHtml(lienAdmin)}" style="display:inline-block;background:#2f6f1f;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:8px">Ouvrir les messages</a></p>
</td></tr></table></td></tr></table></body></html>`

  return { subject: sujet, text, html }
}
