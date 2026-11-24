# Contexte produit

## Objectif
Remplacer le site statique actuel (roulette + registre Google Sheet) par une vraie application avec comptes.
Usage principal : un couple joue en physique à des jeux de société à la maison ; l'app choisit le jeu, enregistre
les résultats et produit des statistiques. Elle doit pouvoir accueillir d'autres utilisateurs plus tard.

## Fonctionnalités cibles
1. **Comptes** : inscription / connexion, chaque utilisateur a sa collection.
2. **Collection** : ajout de jeux depuis BoardGameGeek (recherche + import de collection par pseudo BGG),
   ajout manuel possible. Pour chaque jeu de sa collection : catégorie de durée **fast / mid / big**, extensions et
   réglages tirables au sort.
3. **Tirage** : choisir un jeu au hasard (filtre fast/mid/big optionnel), puis tirer ses réglages
   (booléen = 50/50 ; choix = probabilité égale entre les options). Animation de tirage.
4. **Championnats** : un championnat = des membres + des saisons. On y enregistre des parties :
   date, jeu, réglages utilisés (ou « no data »), score et vainqueur de chaque joueur, saison.
5. **Statistiques** : victoires par joueur, par jeu, par saison et overall ; jeux les plus joués ; évolution dans le temps.
6. **Reprise de l'existant** : import de la Saison 1 (colonnes Date, Jeu, Paramètres, Vainqueur, Saison) depuis un CSV.

## Exemple de réglages (jeu Everdell)
Extension principale (Jeu de base / Spirecrest / Pearlbrook) · Bellfaire oui/non · Cartes légendaires oui/non ·
Pouvoir héroïque oui/non · Cartes carnaval oui/non. Chaque jeu peut avoir ses propres réglages.

## Principes d'usage
- Le moins d'actions possible pour noter un résultat (idéalement : tirage → un clic sur le vainqueur).
- L'utilisateur n'est pas développeur : messages d'erreur clairs, instructions pas à pas dans la doc.
- Textes d'interface en français.

## Hors périmètre (pour l'instant)
Paiement, application mobile native, jeu en ligne, classement public, usage commercial.