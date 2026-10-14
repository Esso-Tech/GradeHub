# Exemples de requêtes (curl)

API sur `http://localhost:4000`. Remplacez les valeurs entre `<...>`.

## 1. Compte famille et connexion
```bash
curl -s -X POST localhost:4000/api/auth/register -H 'Content-Type: application/json' \
  -d '{"nom":"Kafui Test","email":"kafui@example.com","telephone":"+22890111111","motDePasse":"motdepasse123"}'

# Le token est dans la réponse
export TOKEN=<token>
```

## 2. Établissements, devis, demande
```bash
curl -s localhost:4000/api/etablissements

curl -s "localhost:4000/api/demandes/devis?etablissementId=<id>&anneeSortie=2025&urgence=false" \
  -H "Authorization: Bearer $TOKEN"

curl -s -X POST localhost:4000/api/demandes -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{
  "etablissementId":"<id>","typeDocument":"BEPC","anneeSortie":2025,
  "eleveNom":"Test","elevePrenom":"Kafui",
  "mandat":{"mandantNom":"Kafui Test","consentementDepot":true,"consentementTransmission":true}
}'
```
Sans `consentementDepot` et `consentementTransmission` à `true`, la demande est refusée (422).

## 3. Paiement et confirmation simulée
```bash
curl -s -X POST localhost:4000/api/paiements -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"demandeId":"<id>","type":"SUIVI","operateur":"TMONEY","telephone":"+22890111111"}'
# → noter referenceExterne (ex. TMONEY-<id>)

npm run paiement:simuler -- <referenceExterne> CONFIRME
npm run paiement:simuler -- <referenceExterne> REFUSE "Trop cher pour moi"
```
La demande passe à `PAYEE` après un `CONFIRME`. Le webhook rejoué est sans effet.

## 4. Parcours admin
```bash
curl -s -X POST localhost:4000/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"admin@gradehub.local","motDePasse":"ChangeMe-12345"}'
export ADMIN=<token>

for S in DEPOSEE_ETABLISSEMENT EN_COURS SIGNEE; do
  curl -s -X POST localhost:4000/api/admin/demandes/<id>/statut -H "Authorization: Bearer $ADMIN" \
    -H 'Content-Type: application/json' -d "{\"statut\":\"$S\"}"; echo
done

curl -s -X POST localhost:4000/api/admin/demandes/<id>/scan -H "Authorization: Bearer $ADMIN" -F scan=@releve.pdf
curl -s -X POST localhost:4000/api/admin/demandes/<id>/deplacements -H "Authorization: Bearer $ADMIN"
curl -s -X POST localhost:4000/api/admin/demandes/<id>/envoi -H "Authorization: Bearer $ADMIN" \
  -H 'Content-Type: application/json' -d '{"coutEnvoiXof":1000,"adresseEnvoi":"Quartier X, Lomé"}'
curl -s localhost:4000/api/admin/stats -H "Authorization: Bearer $ADMIN"
```

## 5. Vérifications utiles
- Transition interdite (ex. `EN_ATTENTE_PAIEMENT` → `SIGNEE`) : réponse 409.
- Webhook sans signature valide : réponse 401.
- Express (`"urgence":true`) : refusé (422) tant que `FRAIS_EXPRESS_XOF=0`.
- Lien du scan : `GET /api/documents/demande/<id>/lien`, valable 10 minutes.
