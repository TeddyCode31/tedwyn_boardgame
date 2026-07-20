# Où mettre la musique

Déposez votre fichier **ici même**, dans ce dossier `audio/`, en le nommant
exactement :

```
audio/theme.mp3
```

Le site le chargera automatiquement au clic sur "Tirer la soirée", et le
gardera en lecture (avec mémorisation de la position) en passant à la page
du registre.

## Je n'ai pas de morceau sous la main

Je ne peux pas vous fournir de musique moi-même (droits d'auteur), mais pour
l'ambiance Wes Anderson (façon Alexandre Desplat / Mark Mothersbaugh), cherchez
sur une bibliothèque libre de droits avec des mots-clés comme :
`quirky whistling folk`, `vintage ukulele indie`, `wistful orchestral pizzicato`.
Des sources possibles : YouTube Audio Library, Pixabay Music, Uppbeat — vérifiez
la licence indiquée avant usage, même pour un site privé.

## Vous préférez un autre format ou un autre nom de fichier ?

Ouvrez `index.html` et `scores.html`, cherchez la ligne :

```html
<audio id="bgMusic" src="audio/theme.mp3" loop preload="none"></audio>
```

et changez `audio/theme.mp3` par le chemin de votre choix (`.mp3`, `.ogg` et
`.m4a` fonctionnent tous dans les navigateurs modernes).
