# AGENTS.md — point d'entrée unique pour l'IA

Lis ce fichier en premier à chaque session. Il reste court : le détail est dans `docs/`.

## Projet
Application web privée pour jouer aux jeux de société à deux (ou plus) : gérer sa collection (via BoardGameGeek),
tirer au sort le jeu et ses réglages, organiser des championnats, noter scores et dates, voir des statistiques.
Détails produit : `docs/CONTEXTE.md`. Choix techniques : `docs/ARCHITECTURE.md`. Plan de travail : `docs/ROADMAP.md`.
Charte graphique : `docs/DESIGN.md`.

## Stack (ne pas en changer sans me demander)
Next.js (App Router) + TypeScript strict · Supabase (Postgres + Auth + RLS) · Vercel · Vitest pour les tests.

## Méthode de travail
1. Une seule phase de `docs/ROADMAP.md` à la fois. Ne commence pas la suivante sans mon accord.
2. Avant de coder : propose un plan court (fichiers touchés, étapes) et attends ma validation.
3. Petites étapes : une tâche = un commit. Message de commit : `type(portée): résumé` (ex. `feat(auth): page de connexion`).
4. Une branche par phase (`phase-2-schema`). Jamais de commit direct sur `main`.
5. À la fin de chaque tâche : lance `npm run lint`, `npm run typecheck`, `npm test`, puis résume ce qui a changé et comment le tester.
6. Mets à jour la case correspondante dans `docs/ROADMAP.md` et ajoute une ligne dans `docs/DECISIONS.md` si un choix a été fait.

## Règles de code
- TypeScript strict, pas de `any`. Fonctions courtes, noms explicites (code en anglais, textes d'interface en français).
- La logique métier pure (tirage aléatoire, calcul de stats) vit dans `src/lib/` et a des tests Vitest.
- Les accès base de données passent par `src/lib/db/` ; pas de requêtes SQL dans les composants.
- Schéma de base : uniquement via des fichiers dans `supabase/migrations/` (jamais de modification manuelle non versionnée).
- Row Level Security activée sur toutes les tables, avec une politique explicite par table.

## Sécurité (non négociable)
- Aucun secret dans le code ni dans Git. Secrets dans `.env.local` (ignoré par Git) ; garder `.env.example` à jour sans valeurs.
- Le jeton BGG et la clé `service_role` Supabase ne sont utilisés que côté serveur (route handlers / server actions), jamais exposés au navigateur.
- Ne jamais afficher ni logger un secret. Si tu en vois un dans un fichier, signale-le-moi.

## Interdits
- Ne pas supprimer de fichiers ni de données sans ma confirmation explicite.
- Ne pas installer de dépendance lourde sans justification (propose-la d'abord).
- Ne pas inventer d'API : pour BGG, lis la doc officielle https://boardgamegeek.com/using_the_xml_api ; si tu n'es pas sûr, dis-le.

## Commandes
`npm run dev` · `npm run lint` · `npm run typecheck` · `npm test` · `npm run build`