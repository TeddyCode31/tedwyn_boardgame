/* ============================================================================
   REGISTRE — page scores.html
   ============================================================================ */

let activeSeasonFilter = "all"; // "all" ou id de saison

document.addEventListener("DOMContentLoaded", () => {
  renderPendingDraw();
  renderSeasonTabs();
  renderManualGameOptions();
  renderAll();

  document.getElementById("addSeasonBtn").addEventListener("click", () => {
    const name = prompt("Nom de la nouvelle saison (ex : Saison 2)");
    if (name && name.trim()) {
      addSeason(name.trim());
      renderSeasonTabs();
      renderAll();
    }
  });

  document.getElementById("manualForm").addEventListener("submit", onManualSubmit);
  document.getElementById("exportBtn").addEventListener("click", exportBackup);
  document.getElementById("importInput").addEventListener("change", onImport);
});

/* ---- 1. Tirage en attente : validation en UN clic ------------------------- */

function renderPendingDraw() {
  const host = document.getElementById("pendingHost");
  const pending = loadPendingDraw();
  if (!pending) { host.innerHTML = ""; return; }

  const paramsLines = Object.entries(pending.params || {})
    .map(([label, value]) => `${label} : ${value}`)
    .join(" · ") || "Aucun réglage";

  host.innerHTML = `
    <div class="pending-card">
      <p class="index-card__eyebrow" style="color:var(--brass);">Tirage en attente</p>
      <h2 class="pending-card__title">${pending.gameName}</h2>
      <p class="pending-card__params">${paramsLines}</p>
      <p class="pending-card__params" style="opacity:0.6;">Qui a gagné cette partie ?</p>
      <div class="pending-card__actions">
        <button class="btn btn--brick" data-winner="p1">${PLAYERS.p1.name} a gagné</button>
        <button class="btn btn--sage" data-winner="p2">${PLAYERS.p2.name} a gagné</button>
        <button class="btn btn--ghost" id="dismissPending" type="button">Ignorer ce tirage</button>
      </div>
    </div>
  `;

  host.querySelectorAll("[data-winner]").forEach(btn => {
    btn.addEventListener("click", () => {
      addMatch({
        id: "m_" + Date.now().toString(36),
        date: new Date().toISOString().slice(0, 10),
        season: currentSeasonId(),
        gameId: pending.gameId,
        gameName: pending.gameName,
        winner: btn.dataset.winner,
        params: pending.params && Object.keys(pending.params).length ? pending.params : null
      });
      clearPendingDraw();
      renderPendingDraw();
      renderAll();
    });
  });

  document.getElementById("dismissPending").addEventListener("click", () => {
    clearPendingDraw();
    renderPendingDraw();
  });
}

/* ---- 2. Onglets de saison --------------------------------------------------- */

function renderSeasonTabs() {
  const seasons = loadSeasons();
  const host = document.getElementById("seasonTabs");
  host.innerHTML = `<button data-season="all" class="${activeSeasonFilter === 'all' ? 'is-active' : ''}">Toutes les saisons</button>` +
    seasons.map(s => `<button data-season="${s.id}" class="${activeSeasonFilter === s.id ? 'is-active' : ''}">${s.name}</button>`).join("") +
    `<button id="addSeasonBtn" title="Ajouter une saison">+ Nouvelle saison</button>`;

  host.querySelectorAll("button[data-season]").forEach(btn => {
    btn.addEventListener("click", () => {
      activeSeasonFilter = btn.dataset.season;
      renderSeasonTabs();
      renderAll();
    });
  });
  document.getElementById("addSeasonBtn").addEventListener("click", () => {
    const name = prompt("Nom de la nouvelle saison (ex : Saison 2)");
    if (name && name.trim()) {
      const s = addSeason(name.trim());
      activeSeasonFilter = s.id;
      renderSeasonTabs();
      renderManualSeasonOptions();
      renderAll();
    }
  });
}

/* ---- 3. Formulaire de saisie manuelle (rattrapage saison 1, etc.) --------- */

function renderManualGameOptions() {
  const select = document.getElementById("manualGame");
  select.innerHTML = GAMES.map(g => `<option value="${g.id}">${g.name}</option>`).join("");
  renderManualSeasonOptions();
}

function renderManualSeasonOptions() {
  const select = document.getElementById("manualSeason");
  const seasons = loadSeasons();
  select.innerHTML = seasons.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
  select.value = currentSeasonId();
}

function onManualSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const gameId = form.manualGame.value;
  const game = getGameById(gameId);
  const noData = form.manualNoData.checked;

  addMatch({
    id: "m_" + Date.now().toString(36),
    date: form.manualDate.value || new Date().toISOString().slice(0, 10),
    season: form.manualSeason.value,
    gameId: gameId,
    gameName: game ? game.name : gameId,
    winner: form.manualWinner.value,
    params: noData ? "no data" : (form.manualParamsNote.value.trim() || null)
  });

  form.reset();
  document.getElementById("manualNoData").checked = true;
  renderManualSeasonOptions();
  renderAll();
  const msg = document.getElementById("manualFeedback");
  msg.textContent = "Partie enregistrée.";
  setTimeout(() => { msg.textContent = ""; }, 2500);
}

/* ---- 4. Statistiques -------------------------------------------------------- */

function getFilteredMatches() {
  const all = loadMatches().sort((a, b) => a.date.localeCompare(b.date));
  if (activeSeasonFilter === "all") return all;
  return all.filter(m => m.season === activeSeasonFilter);
}

function renderAll() {
  const matches = getFilteredMatches();
  renderScoreTotals(matches);
  renderGameBars(matches);
  renderMatchTable(matches);
}

function renderScoreTotals(matches) {
  const total = matches.length;
  const p1Wins = matches.filter(m => m.winner === "p1").length;
  const p2Wins = matches.filter(m => m.winner === "p2").length;
  const pct = n => total ? Math.round((n / total) * 100) : 0;

  document.getElementById("totalGames").textContent = total;
  document.getElementById("scoreTotals").innerHTML = `
    <div class="index-card score-col score-col--p1">
      <p class="index-card__eyebrow">${PLAYERS.p1.name}</p>
      <p class="score-col__count">${p1Wins}</p>
      <p class="score-col__pct">${pct(p1Wins)}% des parties</p>
    </div>
    <div class="index-card score-col score-col--p2">
      <p class="index-card__eyebrow">${PLAYERS.p2.name}</p>
      <p class="score-col__count">${p2Wins}</p>
      <p class="score-col__pct">${pct(p2Wins)}% des parties</p>
    </div>
  `;
}

function renderGameBars(matches) {
  const host = document.getElementById("gameBars");
  if (!matches.length) {
    host.innerHTML = `<p class="draw-status">Aucune partie enregistrée pour cette période.</p>`;
    return;
  }
  const byGame = {};
  matches.forEach(m => {
    byGame[m.gameName] = byGame[m.gameName] || { p1: 0, p2: 0 };
    byGame[m.gameName][m.winner] += 1;
  });
  const rows = Object.entries(byGame)
    .sort((a, b) => (b[1].p1 + b[1].p2) - (a[1].p1 + a[1].p2))
    .map(([name, v]) => {
      const total = v.p1 + v.p2;
      const p1pct = total ? (v.p1 / total) * 100 : 0;
      const p2pct = total ? (v.p2 / total) * 100 : 0;
      return `
        <div class="bar-row">
          <span class="bar-row__label">${name}</span>
          <span class="bar-row__track">
            <span class="bar-row__fill--p1" style="width:${p1pct}%"></span>
            <span class="bar-row__fill--p2" style="width:${p2pct}%"></span>
          </span>
          <span class="bar-row__total">${total}</span>
        </div>
      `;
    }).join("");
  host.innerHTML = rows;
}

function renderMatchTable(matches) {
  const host = document.getElementById("matchTableBody");
  if (!matches.length) {
    host.innerHTML = `<tr><td colspan="5" style="opacity:0.6;">Rien à afficher pour l'instant.</td></tr>`;
    return;
  }
  host.innerHTML = matches.slice().reverse().map(m => {
    const paramsText = m.params === "no data" || m.params === null
      ? '<span style="opacity:0.5;">no data</span>'
      : (typeof m.params === "string" ? m.params : Object.entries(m.params).map(([k, v]) => `${k}: ${v}`).join(", "));
    const winnerTag = m.winner === "p1"
      ? `<span class="winner-tag winner-tag--p1">${PLAYERS.p1.name}</span>`
      : `<span class="winner-tag winner-tag--p2">${PLAYERS.p2.name}</span>`;
    return `
      <tr>
        <td>${m.date}</td>
        <td>${m.gameName}</td>
        <td>${winnerTag}</td>
        <td>${paramsText}</td>
        <td><button class="btn btn--ghost" style="padding:4px 10px;font-size:0.65rem;" onclick="onDeleteMatch('${m.id}')">Retirer</button></td>
      </tr>
    `;
  }).join("");
}

function onDeleteMatch(id) {
  if (confirm("Retirer cette partie du registre ?")) {
    deleteMatch(id);
    renderAll();
  }
}

/* ---- 5. Sauvegarde ----------------------------------------------------------- */

function onImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  importBackup(file, (ok) => {
    const msg = document.getElementById("backupFeedback");
    msg.textContent = ok ? "Sauvegarde importée avec succès." : "Le fichier n'a pas pu être lu.";
    if (ok) {
      renderSeasonTabs();
      renderManualSeasonOptions();
      renderPendingDraw();
      renderAll();
    }
    setTimeout(() => { msg.textContent = ""; }, 3000);
  });
  e.target.value = "";
}
