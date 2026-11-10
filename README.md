# TP documentaire n°1 – CAP Électricien

**Préparer une installation en sécurité** – TP en autonomie (3 h 30) sur PC portable et téléphone.
GRETA GIP FIPAN – Académie de Nice.

## Contenu
- 5 missions, 46 exercices, 120 points corrigés automatiquement (QCM, vrai/faux, associations, remise en ordre, calculs générés au hasard, repérage d'erreurs).
- Tâches avec le téléphone : photos, recherche web, compte rendu oral enregistré.
- Page Bilan : scores par mission, réponses rédigées, impression PDF, copie ou téléchargement du bilan.
- QR code sur la page d'accueil pour ouvrir le TP sur le téléphone.

## Mise en ligne (GitHub Pages)
1. Créer un dépôt public (ex. `tp-documentaire-cap`) et y déposer tout le contenu de ce dossier.
2. Settings › Pages › Deploy from a branch › branche `main`, dossier `/ (root)` › Save.
3. Le TP est en ligne à `https://<compte>.github.io/tp-documentaire-cap/`.

## Données
Les réponses sont enregistrées uniquement dans le navigateur de l'appareil (localStorage). Rien n'est envoyé sur internet.
Remise à zéro : page Bilan › « Recommencer le TP (formateur) ».

## Modifier les questions
Tout le contenu est dans `js/data.js` (un objet par exercice).

Bibliothèque QR code : qrcode-generator (Kazuhiko Arase, licence MIT).
