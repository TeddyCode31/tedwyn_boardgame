/* ============================================================================
   CONFIGURATION DES JEUX
   ============================================================================
   C'EST LE SEUL FICHIER À MODIFIER pour :
     - ajouter un jeu
     - retirer un jeu
     - ajouter / retirer un paramètre (extension, module, variante...) sur un jeu

   RÈGLES À RESPECTER QUAND VOUS MODIFIEZ CE FICHIER :

   1. Chaque jeu a un "id" unique, SANS accent, SANS espace, tout en minuscule,
      avec des tirets à la place des espaces (ex: "duel-pour-cardia").
      -> Cet id sert aussi de nom de fichier pour la photo du jeu.
         Si l'id est "everdell", la photo doit s'appeler : everdell.jpg
         (voir images/games/README.md pour le détail)

   2. Chaque paramètre a :
        - "id"      : identifiant unique dans le jeu (sans accent/espace)
        - "label"   : le texte affiché à l'écran (accents/espaces autorisés ici)
        - "type"    : "boolean" (Oui/Non, 50/50) ou "choice" (liste d'options,
                      probabilité égale entre toutes les options)
        - "options" : uniquement pour type "choice", la liste des choix possibles

   3. Un jeu sans paramètre a simplement : parameters: []

   4. Chaque jeu a aussi un champ "duration" qui sert au filtre "Fast / Mid / Big"
      affiché avant le tirage. Valeurs possibles : "fast", "mid", "big".
      -> ⚠️ Duel Seigneur des Anneaux, Harmonies, Parks, Lueur et Les Aventuriers
         du Rail Europe sont réglés sur "mid" par défaut car vous ne m'avez pas
         précisé leur catégorie — changez simplement la valeur ci-dessous pour
         chacun si besoin (aucun autre fichier à toucher).

   Pour ajouter un jeu, copiez un bloc { ... } ci-dessous, changez les valeurs,
   et ajoutez une virgule avant le bloc suivant. Rien d'autre à toucher.
   ============================================================================ */

const GAMES = [
  {
    id: "everdell",
    duration: "big",
    name: "Everdell",
    parameters: [
      {
        id: "extension_principale",
        label: "Extension principale",
        type: "choice",
        options: ["Jeu de base", "Spirecrest", "Pearlbrook"]
      },
      {
        id: "bellfaire",
        label: "Bellfaire (Marché, Événement, Forêt)",
        type: "boolean"
      },
      {
        id: "cartes_legendaires",
        label: "Cartes légendaires",
        type: "boolean"
      },
      {
        id: "pouvoir_heroique",
        label: "Pouvoir héroïque",
        type: "boolean"
      },
      {
        id: "cartes_carnaval",
        label: "Cartes carnaval",
        type: "boolean"
      }
    ]
  },
  {
    id: "inis",
    duration: "big",
    name: "Inis",
    parameters: []
  },
  {
    id: "duel-seigneur-des-anneaux",
    duration: "mid",
    name: "Duel : Seigneur des Anneaux",
    parameters: []
  },
  {
    id: "harmonies",
    duration: "mid",
    name: "Harmonies",
    parameters: [
      {
        id: "plateau",
        label: "Plateau",
        type: "choice",
        options: ["Plateau eau", "Plateau terre"]
      }
    ]
  },
  {
    id: "parks",
    duration: "mid",
    name: "Parks",
    parameters: [
      { id: "nightfall", label: "Extension Nightfall", type: "boolean" },
      { id: "wildlife", label: "Extension Wildlife", type: "boolean" }
    ]
  },
  {
    id: "living-forest",
    duration: "big",
    name: "Living Forest",
    parameters: []
  },
  {
    id: "sea-salt-and-pepper",
    duration: "fast",
    name: "Sea Salt and Pepper",
    parameters: []
  },
  {
    id: "duel-pour-cardia",
    duration: "fast",
    name: "Duel pour Cardia",
    parameters: [
      {
        id: "paquet",
        label: "Paquet",
        type: "choice",
        options: ["Paquet 1", "Paquet 2"]
      },
      {
        id: "protection_nature",
        label: "Protection de la nature",
        type: "boolean"
      }
    ]
  },
  {
    id: "lueur",
    duration: "mid",
    name: "Lueur",
    parameters: [
      {
        id: "plateau",
        label: "Plateau",
        type: "choice",
        options: ["Terre", "Mer"]
      }
    ]
  },
  {
    id: "aventuriers-du-rail-europe",
    duration: "mid",
    name: "Les Aventuriers du Rail Europe (Big Cities)",
    parameters: []
  }
];
