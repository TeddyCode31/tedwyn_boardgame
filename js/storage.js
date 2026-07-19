/* ============================================================================
   STOCKAGE DES DONNÉES
   ============================================================================
   Toutes les données (parties jouées, saisons) sont enregistrées directement
   dans le navigateur (localStorage). Rien à configurer, rien à connecter :
   ça fonctionne dès l'ouverture de la page, sur cet ordinateur/navigateur.

   -> Pensez de temps en temps à cliquer sur "Exporter une sauvegarde" dans la
      page Registre, et à ranger le fichier .json obtenu dans votre Drive.
      C'est votre filet de sécurité si le navigateur efface ses données.

   NOMS DES JOUEURS
   -----------------
   Modifiez simplement les deux lignes ci-dessous pour changer les noms
   affichés partout sur le site.
   ============================================================================ */

const PLAYERS = {
  p1: { id: "moi", name: "Moi" },
  p2: { id: "compagne", name: "Ma compagne" }
};

const STORAGE_KEYS = {
  MATCHES: "bgn_matches_v1",
  SEASONS: "bgn_seasons_v1",
  PENDING_DRAW: "bgn_pending_draw_v1"
};

/* ---- Parties jouées ------------------------------------------------------ */

function loadMatches() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.MATCHES) || "[]");
}

function saveMatches(matches) {
  localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
}

function addMatch(match) {
  const matches = loadMatches();
  matches.push(match);
  saveMatches(matches);
  return match;
}

function deleteMatch(matchId) {
  const matches = loadMatches().filter(m => m.id !== matchId);
  saveMatches(matches);
}

/* ---- Saisons --------------------------------------------------------------
   Saison 1 existe déjà (celle que vous allez saisir manuellement).
   Vous pouvez en ajouter d'autres depuis la page Registre. */

function loadSeasons() {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.SEASONS) || "null");
  if (stored && stored.length) return stored;
  const defaults = [{ id: "saison-1", name: "Saison 1" }];
  localStorage.setItem(STORAGE_KEYS.SEASONS, JSON.stringify(defaults));
  return defaults;
}

function saveSeasons(seasons) {
  localStorage.setItem(STORAGE_KEYS.SEASONS, JSON.stringify(seasons));
}

function addSeason(name) {
  const seasons = loadSeasons();
  const id = "saison-" + (seasons.length + 1) + "-" + Date.now().toString(36);
  seasons.push({ id, name });
  saveSeasons(seasons);
  return seasons[seasons.length - 1];
}

function currentSeasonId() {
  const seasons = loadSeasons();
  return seasons[seasons.length - 1].id;
}

/* ---- Tirage en attente -----------------------------------------------------
   Quand la roulette termine un tirage, il est stocké ici automatiquement.
   La page Registre le récupère pour proposer l'enregistrement en un clic. */

function savePendingDraw(draw) {
  localStorage.setItem(STORAGE_KEYS.PENDING_DRAW, JSON.stringify(draw));
}

function loadPendingDraw() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_DRAW) || "null");
}

function clearPendingDraw() {
  localStorage.removeItem(STORAGE_KEYS.PENDING_DRAW);
}

/* ---- Export / Import (sauvegarde de sécurité) ----------------------------- */

function exportBackup() {
  const payload = {
    exportedAt: new Date().toISOString(),
    matches: loadMatches(),
    seasons: loadSeasons()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "soirees-jeux-sauvegarde-" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importBackup(file, onDone) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (data.matches) saveMatches(data.matches);
      if (data.seasons) saveSeasons(data.seasons);
      onDone(true);
    } catch (e) {
      onDone(false, e);
    }
  };
  reader.readAsText(file);
}

/* ---- Utilitaire ------------------------------------------------------------ */

function getGameById(id) {
  return GAMES.find(g => g.id === id);
}
