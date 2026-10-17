# Paiement T-Money / Flooz et alertes e-mail

## 1. Paiement mobile avec PayGate Global

T-Money (Togocom) et Flooz (Moov Africa) ne se branchent pas en direct : on passe par un intégrateur.
GRADE HUB utilise **PayGate Global** (https://paygateglobal.com), qui gère les deux réseaux.

### Ouvrir le compte
1. Créer un compte sur PayGate Global.
2. Le compte est inactif au départ. Il faut fournir : la carte de formalités des entreprises ou la carte d'immatriculation fiscale, la carte d'identité du promoteur, le descriptif du projet, un contact et l'URL de rappel (voir plus bas).
3. Après activation, récupérer la **clé API** dans le tableau de bord, et le **guide d'intégration**.

> Un compte activé suppose une activité enregistrée. Tant que ce n'est pas le cas, restez en `PAYMENT_PROVIDER=simulation`.

### Configurer le backend (`backend/.env`)
```
PAYMENT_PROVIDER=paygate
PAYGATE_AUTH_TOKEN=<clé API du tableau de bord>
PAYGATE_WEBHOOK_KEY=<chaîne aléatoire de 16 caractères ou plus>
```
Dans le tableau de bord PayGate, renseigner l'**URL de rappel** :
```
https://<votre-api>/api/webhooks/paiement/paygate?k=<PAYGATE_WEBHOOK_KEY>
```
L'API doit être joignable en **HTTPS public** : en local, restez en simulation.

### Comment ça marche
1. La famille choisit T-Money ou Flooz et saisit le numéro qui paie.
2. Le serveur calcule le montant (jamais fourni par le navigateur), puis demande le paiement à PayGate avec l'identifiant du paiement.
3. Le client reçoit une demande de confirmation sur son téléphone et saisit son code.
4. La page de paiement interroge l'état toutes les 4 secondes ; dès « confirmé », la demande passe à **Payée**.
5. PayGate appelle aussi l'URL de rappel. **Son contenu n'est jamais cru** : le serveur revérifie le statut et le montant auprès de PayGate avant tout changement.
6. Filet de sécurité : toutes les 5 minutes, les paiements en attente sont revérifiés ; après 24 h sans confirmation, ils passent en « expiré ».

### Sécurité
- Montant calculé côté serveur ; un montant différent de celui demandé n'est **pas** confirmé (trace dans le journal : « Montant de paiement incohérent »).
- Clé `k` dans l'URL de rappel (comparaison à temps constant) pour écarter les appels parasites.
- Résultat appliqué de façon atomique : webhook, sondage de la page et tâche de réconciliation peuvent arriver en même temps sans doublon.
- Le jeton PayGate n'est jamais écrit dans les journaux.

### À vérifier avant la mise en production
Le client a été écrit d'après la documentation publique et les bibliothèques communautaires de PayGate (non officielles). À comparer avec le **guide d'intégration de votre compte** :
- chemins `/api/v1/pay` et `/api/v2/status` (modifiables via `PAYGATE_BASE_URL` pour la base ; les chemins sont dans `backend/src/integrations/paygate.client.ts`) ;
- codes de statut (0 payé, 2 en cours, 4 expiré, 6 annulé) ;
- longueur maximale de l'`identifier` (nous envoyons l'identifiant interne du paiement, 25 caractères).

**Test réel conseillé** : un paiement de 100 F CFA sur chaque réseau avant d'ouvrir au public.

### Frais
D'après les informations publiques de PayGate : environ 2,5 % sur Flooz et 3 % sur T-Money, soit **37,5 F CFA** et **45 F CFA** sur 1 500 F CFA. Le reversement n'est pas immédiat (Flooz à J+1, T-Money tous les 10 jours selon la documentation communautaire). Ces frais s'ajoutent au coût d'une demande : à intégrer au calcul « 1 500 F CFA couvre-t-il le coût d'une demande ? ».

### Tester sans argent
`PAYMENT_PROVIDER=simulation` (valeur par défaut) : la confirmation passe par un webhook signé.
```bash
cd backend && npm run paiement:simuler -- <referenceExterne> CONFIRME
```

## 2. Alerte e-mail à chaque nouveau message

Quand un visiteur envoie un message depuis la page Contact, l'administrateur reçoit un e-mail (sujet, expéditeur, message, bouton « Ouvrir les messages »). Le bouton « Répondre » écrit directement au visiteur s'il a laissé une adresse e-mail.

### Configuration (`backend/.env`)
```
SMTP_HOST=smtp.votre-fournisseur.tld
SMTP_PORT=587            # 465 avec SMTP_SECURE=true
SMTP_USER=...
SMTP_PASS=...
MAIL_FROM=GRADE HUB <contact@votre-domaine.tg>
ADMIN_NOTIFY_EMAIL=vous@exemple.tg     # facultatif
```
- Destinataire : `ADMIN_NOTIFY_EMAIL`, sinon l'e-mail saisi dans **Admin > Contenu du site**.
- Un fournisseur d'envoi (Brevo, Mailjet, SendGrid, ou la messagerie de votre domaine) donne ces paramètres SMTP. Un expéditeur sur votre propre domaine évite que les e-mails arrivent en spam.
- `SMTP_HOST` vide : aucun e-mail n'est envoyé, les messages restent visibles dans **Messages**.
- Un e-mail raté ne bloque jamais l'envoi du message par le visiteur : l'erreur est seulement journalisée.
- Le contenu saisi par le visiteur est échappé dans l'e-mail (pas d'injection HTML ni d'en-têtes).
