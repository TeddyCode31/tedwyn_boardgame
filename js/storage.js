/* ============================================================================
   RÉGLAGES LOCAUX
   ============================================================================
   Ce fichier gère uniquement ce qui reste dans le navigateur : les noms des
   joueurs, le tirage en attente (entre la page Tirage et la page Registre),
   et le dernier numéro de saison utilisé.

   Les parties elles-mêmes sont désormais stockées dans le Google Sheet
   (voir js/sheets.js et js/sheets-config.js).

   NOMS DES JOUEURS
   -----------------
   Modifiez simplement les deux lignes ci-dessous pour changer les noms
   affichés partout sur le site.
   ============================================================================ */

const PLAYERS = {
  p1: { id: "p1", name: "Tedwyn" },
  p2: { id: "p2", name: "Emmalyn" }
};

const LOCAL_KEYS = {
  PENDING_DRAW: "bgn_pending_draw_v2",
  LAST_SEASON: "bgn_last_season_v1"
};

/* ---- Tirage en attente -----------------------------------------------------
   Quand la roulette termine un tirage, il est stocké ici automatiquement.
   La page Registre le récupère pour proposer l'enregistrement en un clic. */

function savePendingDraw(draw) {
  localStorage.setItem(LOCAL_KEYS.PENDING_DRAW, JSON.stringify(draw));
}

function loadPendingDraw() {
  return JSON.parse(localStorage.getItem(LOCAL_KEYS.PENDING_DRAW) || "null");
}

function clearPendingDraw() {
  localStorage.removeItem(LOCAL_KEYS.PENDING_DRAW);
}

/* ---- Numéro de saison courant -----------------------------------------------
   Mémorise le dernier numéro saisi pour le pré-remplir la fois suivante. */

function getLastSeason() {
  return localStorage.getItem(LOCAL_KEYS.LAST_SEASON) || "2";
}

function setLastSeason(value) {
  localStorage.setItem(LOCAL_KEYS.LAST_SEASON, value);
}

/* ---- Utilitaire ------------------------------------------------------------ */

function getGameById(id) {
  return GAMES.find(g => g.id === id);
}
