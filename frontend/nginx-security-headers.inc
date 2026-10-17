# En-têtes de sécurité communs. nginx n'hérite des add_header du niveau « server » que si le
# « location » n'en déclare aucun : on réinclut donc ce fichier dans chaque location qui a les siens.
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
