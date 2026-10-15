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
