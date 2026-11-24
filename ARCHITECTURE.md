# Architecture

## Stack et pourquoi
| Besoin | Choix | Raison |
|---|---|---|
| Front + back léger | Next.js (App Router) + TypeScript | Un seul projet : pages + routes serveur (nécessaires pour cacher le jeton BGG) |
| Base + comptes | Supabase (Postgres, Auth, RLS) | Postgres standard, auth intégrée, offre gratuite |
| Hébergement | Vercel (offre gratuite « Hobby ») | Déploiement automatique depuis GitHub |
| Tests | Vitest | Rapide, simple |

⚠️ À re-vérifier avant de s'engager : conditions de l'offre gratuite Vercel (usage personnel/non commercial) et limites
Supabase gratuit. Au moment de la rédaction : 500 Mo de base, 50 000 utilisateurs actifs, et **mise en pause du projet
après 1 semaine d'inactivité** (les données sont conservées, il faut le réactiver depuis le tableau de bord).
Parade possible : une tâche planifiée GitHub Actions qui fait une requête légère chaque jour.

## BoardGameGeek (BGG)
- Source officielle : https://boardgamegeek.com/using_the_xml_api (la page publicapi.dev n'est qu'un annuaire).
- **Inscription obligatoire** de l'application sur https://boardgamegeek.com/applications, avec un **jeton** à envoyer
  dans l'en-tête `Authorization: Bearer <jeton>` (domaine `boardgamegeek.com` SANS `www`). Délai d'approbation :
  parfois une semaine ou plus → faire la demande dès le début, en « non commercial ».
- Conditions : afficher le logo « Powered by BGG » (lien vers BGG) sur les pages publiques, ne pas modifier les données
  reçues, créditer BGG.
- Le jeton ne doit JAMAIS aller dans le navigateur : tous les appels BGG passent par des routes serveur (`src/app/api/bgg/*`).
- API XML (pas JSON) → parser avec `fast-xml-parser`. Points d'appel utiles : recherche, détail d'un jeu (`thing`),
  collection d'un pseudo (`collection`, peut répondre « en attente » : prévoir une relance).
- Pendant l'attente du jeton : coder derrière une interface `GameSource` avec une implémentation « saisie manuelle »,
  puis brancher BGG sans toucher au reste.
- Mettre en cache les fiches jeux dans la table `games` pour limiter les appels.

## Modèle de données (Postgres)
- `profiles` (id = auth.users.id, display_name, bgg_username)
- `games` (id, bgg_id unique nullable, name, image_url, min_players, max_players, playing_time, year)
- `collection_items` (user_id, game_id, duration_category `fast|mid|big`, notes) — la collection d'un utilisateur
- `game_parameters` (id, collection_item_id, key, label, type `boolean|choice`, options jsonb) — réglages tirables
- `championships` (id, name, owner_id)
- `championship_members` (championship_id, user_id nullable, guest_name nullable, role)
- `seasons` (id, championship_id, number, started_on, ended_on)
- `matches` (id, championship_id, season_id, game_id, played_on, parameters jsonb nullable → « no data » = null)
- `match_results` (match_id, member_id, score nullable, is_winner)
- Vues SQL pour les statistiques (victoires par joueur/jeu/saison, jeux les plus joués).
- RLS : un utilisateur ne voit que ses collections et les championnats dont il est membre.

## Organisation du code
```
src/app/            pages et routes (auth, collection, tirage, championnats, stats, api/bgg)
src/lib/draw/       logique du tirage (pure, testée)
src/lib/stats/      calculs de statistiques (purs, testés)
src/lib/db/         accès Supabase
src/lib/bgg/        client BGG (serveur uniquement) + parseur XML
supabase/migrations schéma versionné
docs/               contexte, architecture, design, roadmap, décisions
```

## Environnements
`.env.local` (jamais commité) : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY` (serveur), `BGG_API_TOKEN` (serveur). Maintenir `.env.example` sans valeurs.