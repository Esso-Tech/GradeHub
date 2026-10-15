# Sécurité production (Azure)

## Pare-feu Azure (NSG)

- **Entrant** : autoriser **80** (HTTP) et **443** (HTTPS) depuis Internet.
- **SSH (22)** : restreindre la source à **votre IP** (pas `Any`), sauf besoin ponctuel.
- Ne pas ouvrir **4000** (API) ni **5432/5434** (PostgreSQL) : l’API passe uniquement par nginx (`/api`).

## Déploiement Docker

- Fichier **`.env.deploy`** (jamais committer) : `PUBLIC_ORIGIN`, `POSTGRES_PASSWORD`, `RUN_DEMO=false`.
- **`RUN_DEMO=false`** en production : le compte `famille@demo.gradehub.local` / `Demo-12345` ne doit pas être exposé sur Internet.
- **`backend/.env`** : `JWT_SECRET` et `PAYMENT_WEBHOOK_SECRET` longs et aléatoires ; changer `SEED_ADMIN_PASSWORD` après le premier seed.

## HTTPS

1. Pointer un **nom de domaine** vers l’IP de la VM.
2. Renseigner `DOMAIN` et `CERTBOT_EMAIL` dans `.env.deploy`.
3. Sur la VM : `./scripts/init-letsencrypt.sh`
4. Mettre à jour `PUBLIC_ORIGIN=https://votre-domaine` et redémarrer le backend.

## Rotation mot de passe PostgreSQL

Le mot de passe Postgres est fixé à la **création du volume** Docker. Pour le changer :

```bash
sudo docker compose exec db psql -U gradehub -d gradehub -c "ALTER USER gradehub PASSWORD 'nouveau';"
```

Puis aligner `POSTGRES_PASSWORD` et `DATABASE_URL` dans `.env.deploy` / compose et redémarrer le backend.

## Comptes applicatifs

- Changer le mot de passe admin après installation.
- Supprimer les comptes démo si créés par erreur : `npm run demo:reset` (depuis le conteneur backend).
