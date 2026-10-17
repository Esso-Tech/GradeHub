# GRADE HUB

Suivi des demandes de documents scolaires (CEPD, BEPC, relevés de notes) pour les familles, à Lomé.

```
gradehub/
├── frontend/   React (Vite, JSX), PWA : espaces famille et admin séparés
├── backend/    Node.js, Express, TypeScript, Prisma, PostgreSQL
├── docker-compose.yml
└── package.json   (raccourcis de commandes)
```

**Interfaces (après connexion).**

| Rôle | URL | Compte (exemple) |
|------|-----|------------------|
| Famille | `/famille` | `famille@demo.gradehub.local` / `Demo-12345` après `npm run demo` |
| Admin | `/admin` | `admin@gradehub.local` / `ChangeMe-12345` après `npm run seed` |

Paramètres du compte (profil, suppression pour les familles) : menu profil en haut à droite ou `/famille/parametres`, `/admin/parametres`.

> **Statut.** Ce code correspond à la phase 2 du cahier des charges. Le plan de test prévoit d'abord un
> MVP concierge sans développement : n'engagez pas cette phase avant d'avoir atteint les seuils de validation.

## Démarrage

Prérequis : Node.js 20+, Docker.

```bash
# 1. Configuration
cp backend/.env.example backend/.env     # renseigner JWT_SECRET (32 caractères minimum) et PAYMENT_WEBHOOK_SECRET

# 2. Dépendances
npm run install:all

# 3. Base de données
npm run db:up
npm run db:migrate                       # crée les tables (npx prisma migrate dev)
npm run seed                             # compte admin : admin@gradehub.local / ChangeMe-12345

# 4. Lancer (deux terminaux)
npm run dev:backend                      # http://localhost:4000/api/health
npm run dev:frontend                     # http://localhost:5173
```

## Docker (tout le stack)

Prérequis : `backend/.env` avec `JWT_SECRET` (32 caractères min.) et `PAYMENT_WEBHOOK_SECRET`.

```bash
npm run docker:up          # db + API + frontend (nginx)
npm run docker:seed        # admin : voir SEED_ADMIN_* dans backend/.env (défaut ChangeMe-12345)
npm run docker:demo        # famille démo : famille@demo.gradehub.local / Demo-12345
```

| Service | URL |
|---------|-----|
| Application | http://localhost:8081 |
| API directe | http://localhost:4000/api/health |
| PostgreSQL | `localhost:5434` (user `gradehub` / pass `gradehub`) |

```bash
npm run docker:logs        # journaux
npm run docker:down        # arrêter
```

## Déploiement Azure VM

Clé SSH `GradeHub_key.pem` à la racine du dépôt, utilisateur `azureuser`.

```bash
./scripts/deploy-azure.sh
# ou : VM_HOST=4.227.180.151 PUBLIC_ORIGIN=http://4.227.180.151 ./scripts/deploy-azure.sh
```

Sur le portail Azure (**Inbound**), ouvrir **TCP 80** et **443** ; **restreindre SSH (22)** à votre IP si possible. Ne pas exposer les ports **4000** (API) ni **5432** (PostgreSQL).

Application : http://4.227.180.151

Checklist sécurité : [docs/SECURITE.md](docs/SECURITE.md) (`.env.deploy`, `RUN_DEMO=false`, HTTPS avec domaine, mots de passe forts).

Après un déploiement, purge Cloudflare et instructions visiteurs : [docs/MISE-A-JOUR-VISITEURS.md](docs/MISE-A-JOUR-VISITEURS.md).

## Démo

```bash
npm run demo          # 19 demandes fictives (famille@demo.gradehub.local / Demo-12345)
npm run demo:reset    # supprime uniquement les données de démo
```
Les chiffres de la démo sont fictifs : ils ne sont pas des résultats du test MVP.

## À savoir

- T-Money, Flooz, SMS et WhatsApp sont **simulés** (`backend/src/integrations/`). Pour tester un paiement :
  `cd backend && npm run paiement:simuler -- <referenceExterne> CONFIRME`.
- `FRAIS_EXPRESS_XOF=0` : la formule express est refusée tant que son prix n'est pas fixé.
- `RETENTION_SCANS_JOURS=30` est une valeur provisoire.
- Le service worker du PWA n'agit qu'en `build` + `preview`, pas en `dev`.
- Exemples de requêtes API : `backend/docs/EXEMPLES_API.md` (auth : `GET/PATCH /auth/me`, `DELETE /auth/compte` pour les comptes famille).
- Les icônes de `frontend/public/` sont provisoires.
- Alias d’import frontend `@/` : voir `frontend/jsconfig.json` ; compilation backend : `backend/tsconfig.json` (tests : `backend/tsconfig.tests.json`).

## Documentation du projet

Cahier des charges, arborescence et document d'intégration PWA : documents partagés dans la conversation.

## Design du site (vert et orange)

- **Palette** : vert de marque `#2f6f1f` ; **orange** `#f28c28` pour mettre en évidence les textes importants (classes `.hl` surlignage, `.mark` prix, `.tag--orange`, bouton `.btn-orange`). Tout est défini dans `:root` de `frontend/src/styles/index.css`.
- **Pages publiques** : Accueil, Services, Contact, Créer un compte, Connexion (navbar et pied de page dans `components/layout/PublicShell.jsx`, styles dans `styles/site.css`).
- **Coordonnées** (pied de page et page Contact) : à saisir dans l'admin, **Contenu du site** (voir plus bas). `frontend/src/config/site.js` ne sert que de contenu de secours.
- **Polices** : Figtree et Bricolage Grotesque, auto-hébergées (`styles/fonts.css`) et mises en cache par le PWA : le site garde son apparence hors connexion.
- **Logo** : `components/ui/Logo.jsx` et `frontend/brand/logo.svg`. Les icônes PWA se régénèrent avec `python3 frontend/scripts/generate-favicons.py`.
- **Illustrations** : `components/illustrations/` (SVG), remplaçables par des photos.

## Remplir les pages Services et Contact

Le contenu ne se modifie plus dans le code : tout se fait depuis l'espace admin.

1. Connectez-vous en administrateur, puis ouvrez **Contenu du site** (`/admin/site`).
2. **Coordonnées** : téléphone, WhatsApp, e-mail, adresse, horaires. Un champ vide n'est pas affiché. Elles apparaissent dans le pied de page et sur la page Contact (un numéro WhatsApp active le bouton « Écrire sur WhatsApp »).
3. **Services** : deux listes de cartes (documents suivis, prestations incluses), avec titre, description, étiquette facultative, ordre et mise en évidence orange. Une liste vide masque sa section.
4. **Messages** (`/admin/messages`) : les messages envoyés depuis la page Contact, avec « Nouveau », réponse par e-mail, appel ou WhatsApp, et « Marquer comme lu ».

Côté API :

| Route | Accès | Rôle |
|---|---|---|
| `GET /api/site` | public | contenu Services et Contact |
| `POST /api/contact` | public (5 messages / 15 min, champ piège anti-robots) | message du formulaire |
| `PUT /api/admin/site/contact`, `PUT /api/admin/site/services` | admin | enregistrer le contenu |
| `GET /api/admin/messages`, `PATCH /api/admin/messages/:id` | admin | lire et marquer les messages |

Deux tables s'ajoutent (`ReglageSite`, `MessageContact`) : `prisma db push`, déjà lancé au démarrage du conteneur, les crée. Tant que rien n'est enregistré, le site affiche le contenu par défaut (`backend/src/services/site.content.ts`, copié dans `frontend/src/config/site.js` comme contenu de secours).

## Paiement T-Money / Flooz et e-mails

- **Paiement réel** : `PAYMENT_PROVIDER=paygate` active T-Money et Flooz via PayGate Global (compte à activer chez eux). Par défaut `simulation`.
- **Alerte e-mail** à chaque nouveau message de la page Contact : renseigner `SMTP_*` et `MAIL_FROM` dans `backend/.env`.
- Mode d'emploi complet, sécurité, frais et points à vérifier : [`docs/PAIEMENT-ET-EMAIL.md`](docs/PAIEMENT-ET-EMAIL.md).
