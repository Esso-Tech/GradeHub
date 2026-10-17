/**
 * Contenu de secours du site (affiché si l'API est injoignable ou tant que rien n'est enregistré).
 * Le contenu réel se modifie dans l'espace admin : « Contenu du site ».
 * SERVICES_DEFAUT reflète backend/src/services/site.content.ts.
 */
export const SITE_BASE = { name: 'GRADE HUB', city: 'Lomé, Togo' }

export const CONTACT_VIDE = { phone: '', whatsapp: '', email: '', address: '', hours: '' }

export const SERVICES_DEFAUT = {
  documents: [
    { titre: 'CEPD', texte: "Le certificat d'études du premier degré, souvent exigé pour une inscription.", etiquette: 'Fin de cycle', important: false },
    { titre: 'BEPC', texte: "Le brevet d'études du premier cycle, demandé pour les concours et les inscriptions.", etiquette: 'Fin de cycle', important: false },
    { titre: 'Relevés de notes', texte: 'Les relevés de la Seconde à la Terminale, pour une bourse, un concours ou une université.', etiquette: 'Seconde à Terminale', important: false },
  ],
  inclus: [
    { titre: 'Dépôt et suivi', texte: "Nous déposons votre demande et la suivons auprès de l'établissement. Vous voyez où elle en est et ce qui manque.", etiquette: '', important: false },
    { titre: 'Messages à chaque étape', texte: 'Vous êtes prévenu par WhatsApp ou SMS, et rappelé avant votre date limite.', etiquette: '', important: false },
    { titre: 'Scan dès la signature', texte: 'Le scan du document signé est disponible dans votre espace, par un lien sécurisé de courte durée.', etiquette: '', important: false },
    { titre: "Envoi de l'original", texte: "L'original vous est envoyé à l'adresse indiquée. L'envoi est facturé au coût réel.", etiquette: '', important: false },
    { titre: 'Documents anciens', texte: 'Pour un document de plus de deux ans, le délai de traitement est majoré de 50 %.', etiquette: 'Délai majoré de 50 %', important: true },
    { titre: 'Formule express', texte: 'Pour les demandes urgentes : un délai réduit contre un prix majoré.', etiquette: 'Prix à venir', important: true },
  ],
}

const digits = (s) => String(s).replace(/\D/g, '')

export const telLink = (c) => (c.phone ? `tel:+${digits(c.phone)}` : null)
export const mailLink = (c) => (c.email ? `mailto:${c.email}` : null)
export const whatsappLink = (c, text = '') =>
  c.whatsapp ? `https://wa.me/${digits(c.whatsapp)}${text ? `?text=${encodeURIComponent(text)}` : ''}` : null
export const hasContact = (c) => Boolean(c.phone || c.whatsapp || c.email || c.address)
