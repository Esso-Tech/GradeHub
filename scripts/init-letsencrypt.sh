#!/usr/bin/env bash
# Sur la VM, après DNS (DOMAIN → IP). Nécessite .env.deploy avec DOMAIN et CERTBOT_EMAIL.
set -euo pipefail

cd "$(dirname "$0")/.."
set -a
# shellcheck disable=SC1091
source .env.deploy
set +a

if [[ -z "${DOMAIN:-}" || -z "${CERTBOT_EMAIL:-}" ]]; then
  echo "Renseignez DOMAIN et CERTBOT_EMAIL dans .env.deploy"
  exit 1
fi

COMPOSE="sudo docker compose --env-file .env.deploy -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.ssl.yml"

$COMPOSE up -d frontend
$COMPOSE run --rm certbot certonly --webroot -w /var/www/certbot \
  -d "$DOMAIN" --email "$CERTBOT_EMAIL" --agree-tos --no-eff-email

echo "Certificat obtenu. Configurez nginx pour le port 443 (voir docs/SECURITE.md) puis :"
echo "  PUBLIC_ORIGIN=https://${DOMAIN} $COMPOSE up -d --build"
