# Domaine gradehub.techmentors.dev (Cloudflare)

## 1. Enregistrement DNS

Dans **Cloudflare → techmentors.dev → DNS → Enregistrements** :

1. Supprimer l’enregistrement **TXT** sur `gradhub` s’il ne sert pas (erreur de nom ou SPF inutile sur ce sous-domaine).
2. **Ajouter** un enregistrement :
   - **Type** : `A`
   - **Nom** : `gradehub` (pas `gradhub`)
   - **Contenu** : `4.227.180.151`
   - **Proxy** : activé (nuage orange) pour HTTPS côté visiteurs
   - **TTL** : Auto

Résultat : `gradehub.techmentors.dev` → votre VM Azure.

## 2. SSL/TLS Cloudflare

**SSL/TLS → Overview** :

- **Flexible** : HTTPS visiteur ↔ Cloudflare, HTTP Cloudflare ↔ VM (rapide, certificat sur la VM non requis).
- **Complet (strict)** : certificat valide sur la VM (Let’s Encrypt, voir `scripts/init-letsencrypt.sh`).

Pour un MVP : **Flexible** ou **Complet** avec certificat d’origine Cloudflare.

## 3. VM GradeHub

Fichier `.env.deploy` sur la VM :

```env
PUBLIC_ORIGIN=https://gradehub.techmentors.dev
POSTGRES_PASSWORD=...
RUN_DEMO=false
```

Puis :

```bash
cd ~/GradeHub
sudo docker compose --env-file .env.deploy -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

## 4. Vérification

```bash
curl -sI https://gradehub.techmentors.dev/api/health
```

Navigateur : https://gradehub.techmentors.dev
