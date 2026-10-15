# Mise à jour du site pour les visiteurs déjà venus

Après un déploiement, les personnes qui ont déjà ouvert **gradehub.techmentors.dev** peuvent encore voir l’ancienne version à cause du **cache navigateur**, du **service worker (PWA)** ou de **Cloudflare**.

## Côté administrateur (une fois par déploiement)

1. **Cloudflare** → domaine `techmentors.dev` → **Mise en cache** → **Configuration** :
   - Purger le cache : **Purge Everything**, ou au minimum les URLs :
     - `https://gradehub.techmentors.dev/`
     - `https://gradehub.techmentors.dev/index.html`
     - `https://gradehub.techmentors.dev/sw.js`
2. Vérifier que le déploiement VM est à jour (`git pull` + rebuild Docker frontend).

## Message aux utilisateurs (familles)

Vous pouvez leur envoyer :

> Une nouvelle version de GRADE HUB est en ligne.  
> - Sur **telephone** : fermez l’onglet ou l’application, rouvrez **https://gradehub.techmentors.dev**  
> - Sur **ordinateur** : rechargement forcé **Ctrl+Shift+R** (Windows/Linux) ou **Cmd+Shift+R** (Mac)  
> - Si l’écran « Une nouvelle version est disponible » s’affiche : appuyez sur **Mettre à jour**

## Comportement technique (application)

- Le site est une **PWA** : un service worker met en cache les fichiers pour le mode hors ligne.
- À chaque déploiement, les noms de fichiers JS/CSS changent ; le navigateur doit récupérer le nouveau `index.html` et le nouveau `sw.js`.
- L’app vérifie les mises à jour **toutes les 15 minutes** et quand l’utilisateur revient sur l’onglet.
- Avec `autoUpdate`, une nouvelle version peut se charger **automatiquement** au prochain passage sur le site.

## Si une personne ne voit toujours pas la nouvelle version

1. Navigation **privée** / incognito sur la même URL (test).
2. Chrome : **Paramètres du site** → **Données** → supprimer les données pour `gradehub.techmentors.dev`.
3. Application installée sur l’écran d’accueil : la **désinstaller** puis rouvrir le site dans le navigateur et réinstaller si besoin.
