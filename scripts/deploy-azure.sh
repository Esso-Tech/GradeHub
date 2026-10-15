#!/usr/bin/env bash
set -euo pipefail

VM_HOST="${VM_HOST:-4.227.180.151}"
VM_USER="${VM_USER:-azureuser}"
REPO_URL="${REPO_URL:-https://github.com/Esso-Tech/GradeHub.git}"
APP_DIR="${APP_DIR:-/home/azureuser/GradeHub}"
PUBLIC_ORIGIN="${PUBLIC_ORIGIN:-http://4.227.180.151}"
KEY="${DEPLOY_KEY:-GradeHub_key.pem}"
RUN_DEMO="${RUN_DEMO:-false}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KEY_PATH="$ROOT/$KEY"

if [[ ! -f "$KEY_PATH" ]]; then
  echo "Clé introuvable : $KEY_PATH"
  exit 1
fi
chmod 400 "$KEY_PATH"

SSH=(ssh -i "$KEY_PATH" -o StrictHostKeyChecking=accept-new "${VM_USER}@${VM_HOST}")
SCP=(scp -i "$KEY_PATH" -o StrictHostKeyChecking=accept-new)

echo "==> Installation Docker (si nécessaire) sur ${VM_HOST}"
"${SSH[@]}" 'if ! command -v docker >/dev/null 2>&1; then
  sudo apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y ca-certificates curl git
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker "$USER" || true
fi'

echo "==> Code source"
"${SSH[@]}" "if [[ ! -d $APP_DIR/.git ]]; then git clone $REPO_URL $APP_DIR; fi"
"${SSH[@]}" "cd $APP_DIR && git fetch --tags origin && git checkout main && git pull origin main"

echo "==> Fichiers compose / nginx / docs"
for f in docker-compose.prod.yml docker-compose.ssl.yml .env.deploy.example; do
  "${SCP[@]}" "$ROOT/$f" "${VM_USER}@${VM_HOST}:${APP_DIR}/$f"
done
"${SCP[@]}" -r "$ROOT/frontend/nginx.conf" "$ROOT/frontend/nginx-rate-limit.conf" "$ROOT/frontend/nginx-ssl.conf" "$ROOT/frontend/Dockerfile" \
  "${VM_USER}@${VM_HOST}:${APP_DIR}/frontend/"
"${SCP[@]}" -r "$ROOT/docs/SECURITE.md" "${VM_USER}@${VM_HOST}:${APP_DIR}/docs/" 2>/dev/null || \
  "${SSH[@]}" "mkdir -p $APP_DIR/docs" && "${SCP[@]}" "$ROOT/docs/SECURITE.md" "${VM_USER}@${VM_HOST}:${APP_DIR}/docs/SECURITE.md"
"${SCP[@]}" "$ROOT/scripts/init-letsencrypt.sh" "${VM_USER}@${VM_HOST}:${APP_DIR}/scripts/init-letsencrypt.sh" 2>/dev/null || true

if [[ -f "$ROOT/backend/.env" ]]; then
  echo "==> Envoi backend/.env"
  "${SCP[@]}" "$ROOT/backend/.env" "${VM_USER}@${VM_HOST}:${APP_DIR}/backend/.env"
else
  "${SSH[@]}" "cd $APP_DIR && cp -n backend/.env.example backend/.env || true"
fi

echo "==> .env.deploy (production)"
"${SSH[@]}" "cd $APP_DIR && if [[ ! -f .env.deploy ]]; then
  cp .env.deploy.example .env.deploy
  echo \"POSTGRES_PASSWORD=gradehub\" >> .env.deploy
fi
grep -q '^PUBLIC_ORIGIN=' .env.deploy && sed -i \"s|^PUBLIC_ORIGIN=.*|PUBLIC_ORIGIN=$PUBLIC_ORIGIN|\" .env.deploy || echo \"PUBLIC_ORIGIN=$PUBLIC_ORIGIN\" >> .env.deploy
grep -q '^RUN_DEMO=' .env.deploy && sed -i \"s|^RUN_DEMO=.*|RUN_DEMO=$RUN_DEMO|\" .env.deploy || echo \"RUN_DEMO=$RUN_DEMO\" >> .env.deploy"

COMPOSE="sudo docker compose --env-file .env.deploy -f docker-compose.yml -f docker-compose.prod.yml"

echo "==> Build et démarrage Docker (API non exposée publiquement)"
"${SSH[@]}" "cd $APP_DIR && $COMPOSE up -d --build"

echo "==> Seed admin"
"${SSH[@]}" "cd $APP_DIR && $COMPOSE exec -T backend npx tsx prisma/seed.ts"

if [[ "$RUN_DEMO" == "true" ]]; then
  echo "==> Démo (RUN_DEMO=true)"
  "${SSH[@]}" "cd $APP_DIR && $COMPOSE exec -T backend npx tsx prisma/demo.ts"
else
  echo "==> Suppression comptes démo sur la VM (sécurité)"
  "${SSH[@]}" "cd $APP_DIR && $COMPOSE exec -T backend npx tsx prisma/demo.ts reset || true"
fi

echo "==> Santé"
sleep 8
curl -sf "$PUBLIC_ORIGIN/api/health" && echo ""
echo "Déploiement sécurisé terminé : $PUBLIC_ORIGIN"
echo "Voir ${APP_DIR}/docs/SECURITE.md sur la VM (SSH)."
