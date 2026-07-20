# Connecter le registre à Google Sheets

Aucune ligne de code à écrire vous-même : vous copiez-collez ce qui est fourni.
Comptez 10 minutes.

## 1. Créer le Google Sheet

1. Allez sur [sheets.google.com](https://sheets.google.com), créez un classeur vide.
2. Renommez l'onglet du bas (double-clic sur "Feuille 1") en **`Parties`**
   (respectez la majuscule, exactement ce nom).
3. Dans la ligne 1, entrez ces 5 en-têtes, une par colonne, de A1 à E1 :

   | A | B | C | D | E |
   |---|---|---|---|---|
   | Date | Jeu | Paramètres | Vainqueur | Saison |

4. Si vous avez déjà les résultats de la Saison 1, vous pouvez les saisir
   directement ici, ligne par ligne, à partir de la ligne 2 — c'est le moyen
   le plus rapide de rattraper une saison entière. Pour les paramètres non
   connus, écrivez simplement `no data` dans la colonne C.

## 2. Ajouter le script

1. Dans le Sheet, menu **Extensions > Apps Script**.
2. Supprimez le code d'exemple présent, et collez à la place tout le contenu
   du fichier `apps-script/Code.gs` fourni avec le site.
3. Cliquez sur l'icône de disquette (Enregistrer le projet). Donnez-lui un nom,
   ex. `API Registre`.

## 3. Déployer le script comme "Application Web"

1. En haut à droite, cliquez sur **Déployer > Nouveau déploiement**.
2. Cliquez sur la roue dentée à côté de "Sélectionner le type", choisissez
   **Application Web**.
3. Réglages :
   - **Exécuter en tant que** : Moi (votre compte)
   - **Qui a accès** : Tout le monde
4. Cliquez **Déployer**.
5. Google va demander une autorisation la première fois (c'est votre propre
   script, sur votre propre Sheet — cliquez sur "Autoriser l'accès", puis
   "Avancé" > "Accéder à [nom du projet] (non sécurisé)" si Google affiche cet
   avertissement standard pour les scripts personnels).
6. Une fois déployé, **copiez l'URL** affichée (elle ressemble à
   `https://script.google.com/macros/s/XXXXXXX/exec`).

## 4. Connecter le site

1. Ouvrez le fichier `js/sheets-config.js` du site.
2. Remplacez `"COLLEZ_ICI_VOTRE_URL_DE_DEPLOIEMENT"` par l'URL copiée à
   l'étape précédente, entre les guillemets.
3. Enregistrez, puis renvoyez ce fichier sur GitHub (ou re-uploadez tout le
   dossier) pour que le site en ligne utilise la nouvelle adresse.

## Si vous modifiez le script plus tard

Chaque fois que vous changez le contenu de `Code.gs` dans Apps Script, il
faut créer un **nouveau déploiement** (Déployer > Gérer les déploiements >
crayon d'édition > Nouvelle version) pour que les changements soient pris en
compte par le site. L'URL reste la même.
