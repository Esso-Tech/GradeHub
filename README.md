# GRADE HUB

Suivi des demandes de documents scolaires (CEPD, BEPC, relevés de notes) pour les familles, à Lomé.

```
gradehub/
├── frontend/   React (Vite, JSX), PWA : pages famille et admin
├── backend/    Node.js, Express, TypeScript, Prisma, PostgreSQL
├── docker-compose.yml
└── package.json   (raccourcis de commandes)
```

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
- Exemples de requêtes API : `backend/docs/EXEMPLES_API.md`.
- Les icônes de `frontend/public/` sont provisoires.

## Documentation du projet

Cahier des charges, arborescence et document d'intégration PWA : documents partagés dans la conversation.
