# Où mettre les photos des jeux

Placez vos photos directement dans **ce dossier** : `images/games/`

Chaque photo doit porter **exactement le même nom que l'identifiant du jeu**
dans `js/games-config.js` (champ `id`), suivi de `.jpg` (ou `.png` — voir note
plus bas).

## Noms de fichiers attendus pour les 10 jeux actuels

```
images/games/everdell.jpg
images/games/inis.jpg
images/games/duel-seigneur-des-anneaux.jpg
images/games/harmonies.jpg
images/games/parks.jpg
images/games/living-forest.jpg
images/games/sea-salt-and-pepper.jpg
images/games/duel-pour-cardia.jpg
images/games/lueur.jpg
images/games/aventuriers-du-rail-europe.jpg
```

Si une photo est absente, une image de repli (icône dessinée) s'affiche
automatiquement à sa place — le site ne casse jamais.

## Format et poids conseillés

- Format : `.jpg` de préférence (plus léger que `.png`)
- Taille conseillée : 800×500 px environ (pas besoin de plus grand)
- Poids conseillé : sous les 300 Ko par image, pour que le site reste rapide

## Vous utilisez un `.png` ?

Le code cherche `.jpg` par défaut. Si vous préférez du `.png`, ouvrez
`js/roulette.js`, cherchez la ligne :

```js
src="images/games/${game.id}.jpg"
```

et remplacez `.jpg` par `.png`.

## Ajouter un nouveau jeu plus tard

Quand vous ajoutez un jeu dans `js/games-config.js`, donnez-lui un `id` sans
accent ni espace (des tirets à la place), puis déposez une photo portant ce
même nom dans ce dossier. Rien d'autre à faire.
