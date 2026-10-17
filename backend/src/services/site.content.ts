import { contactSchema, servicesSchema, type ContactSite, type ServicesSite } from '../validators/site.schema'

export const CONTACT_PAR_DEFAUT: ContactSite = { phone: '', whatsapp: '', email: '', address: '', hours: '' }

/** Contenu affiché tant que l'administrateur n'a rien enregistré. */
export const SERVICES_PAR_DEFAUT: ServicesSite = {
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

/** Une valeur stockée illisible ne casse jamais le site : on retombe sur le contenu par défaut. */
export function lireContact(valeur: unknown): ContactSite {
  const r = contactSchema.safeParse(valeur)
  return r.success ? r.data : CONTACT_PAR_DEFAUT
}

export function lireServices(valeur: unknown): ServicesSite {
  const r = servicesSchema.safeParse(valeur)
  return r.success ? r.data : SERVICES_PAR_DEFAUT
}
