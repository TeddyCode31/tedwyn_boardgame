/* ============================================================================
   REGISTRE — page scores.html
   ============================================================================ */

let allMatches = [];         // cache local des parties lues depuis le Sheet
let activeSeasonFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
  renderPendingDraw();
  renderManualGameOptions();
  document.getElementById("manualSeason").value = getLastSeason();

  document.getElementById("manualForm").addEventListener("submit", onManualSubmit);
  document.getElementById("refreshBtn").addEventListener("click", loadAndRender);

  loadAndRender();
});

/* ---- Chargement depuis le Google Sheet ------------------------------------- */

async function loadAndRender() {
  const statusEl = document.getElementById("sheetStatus");

  if (!isSheetConfigured()) {
    statusEl.className = "sheet-status";
    statusEl.innerHTML = `Le registre n'est pas encore relié à un Google Sheet.
      Suivez <code>apps-script/INSTRUCTIONS.md</code> puis complétez
      <code>js/sheets-config.js</code>.`;
    allMatches = [];
    renderSeasonTabs();
    renderAll();
    return;
  }

  statusEl.className = "sheet-status";
  statusEl.textContent = "Lecture du registre…";

  try {
    allMatches = await fetchMatchesFromSheet();
    statusEl.textContent = "";
  } catch (err) {
    statusEl.className = "sheet-status sheet-status--error";
    statusEl.textContent = "Impossible de lire le Google Sheet pour le moment. " + err.message;
    allMatches = [];
  }

  renderSeasonTabs();
  renderAll();
}

/* ---- 1. Tirage en attente : validation en UN clic -------------------------- */

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
        <button class="btn btn--brick" data-winner="p1">${PLAYERS.p1.name}</button>
        <button class="btn btn--sage" data-winner="p2">${PLAYERS.p2.name}</button>
        <label class="season-input">Saison
          <input type="text" id="pendingSeason" value="${getLastSeason()}">
        </label>
        <button class="btn btn--ghost" id="dismissPending" type="button">Ignorer ce tirage</button>
      </div>
    </div>
  `;

  host.querySelectorAll("[data-winner]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const season = document.getElementById("pendingSeason").value.trim() || getLastSeason();
      btn.disabled = true;
      try {
        await postMatchToSheet({
          date: new Date().toISOString().slice(0, 10),
          jeu: pending.gameName,
          parametres: paramsLines,
          vainqueur: PLAYERS[btn.dataset.winner].name,
          saison: season
        });
        setLastSeason(season);
        clearPendingDraw();
        renderPendingDraw();
        loadAndRender();
      } catch (err) {
        alert("L'enregistrement a échoué : " + err.message);
        btn.disabled = false;
      }
    });
  });

  document.getElementById("dismissPending").addEventListener("click", () => {
    clearPendingDraw();
    renderPendingDraw();
  });
}

/* ---- 2. Onglets de saison (déduits des données du Sheet) ------------------- */

function renderSeasonTabs() {
  const seasons = [...new Set(allMatches.map(m => m.saison))]
    .sort((a, b) => (isNaN(a) || isNaN(b)) ? String(a).localeCompare(String(b)) : Number(a) - Number(b));

  const host = document.getElementById("seasonTabs");
  host.innerHTML =
    `<button data-season="all" class="${activeSeasonFilter === 'all' ? 'is-active' : ''}">Toutes les saisons</button>` +
    seasons.map(s => `<button data-season="${s}" class="${activeSeasonFilter === s ? 'is-active' : ''}">Saison ${s}</button>`).join("");

  host.querySelectorAll("button[data-season]").forEach(btn => {
    btn.addEventListener("click", () => {
      activeSeasonFilter = btn.dataset.season;
      renderSeasonTabs();
      renderAll();
    });
  });
}

/* ---- 3. Formulaire de saisie manuelle (rattrapage, etc.) ------------------- */

function renderManualGameOptions() {
  const select = document.getElementById("manualGame");
  select.innerHTML = GAMES.map(g => `<option value="${g.name}">${g.name}</option>`).join("");

  const winnerSelect = document.getElementById("manualWinner");
  winnerSelect.innerHTML = `
    <option value="${PLAYERS.p1.name}">${PLAYERS.p1.name}</option>
    <option value="${PLAYERS.p2.name}">${PLAYERS.p2.name}</option>
  `;
}

async function onManualSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const noData = form.manualNoData.checked;
  const season = form.manualSeason.value.trim();
  const submitBtn = form.querySelector("button[type=submit]");
  submitBtn.disabled = true;

  try {
    await postMatchToSheet({
      date: form.manualDate.value || new Date().toISOString().slice(0, 10),
      jeu: form.manualGame.value,
      parametres: noData ? "no data" : (form.manualParamsNote.value.trim() || "no data"),
      vainqueur: form.manualWinner.value,
      saison: season
    });
    setLastSeason(season);
    form.reset();
    document.getElementById("manualNoData").checked = true;
    document.getElementById("manualSeason").value = getLastSeason();
    const msg = document.getElementById("manualFeedback");
    msg.textContent = "Partie enregistrée.";
    setTimeout(() => { msg.textContent = ""; }, 2500);
    loadAndRender();
  } catch (err) {
    alert("L'enregistrement a échoué : " + err.message);
  } finally {
    submitBtn.disabled = false;
  }
}

/* ---- 4. Statistiques -------------------------------------------------------- */

function getFilteredMatches() {
  const sorted = allMatches.slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
  if (activeSeasonFilter === "all") return sorted;
  return sorted.filter(m => m.saison === activeSeasonFilter);
}

function renderAll() {
  const matches = getFilteredMatches();
  renderScoreTotals(matches);
  renderGameBars(matches);
  renderMatchTable(matches);
}

function winnerKey(name) {
  if (name === PLAYERS.p1.name) return "p1";
  if (name === PLAYERS.p2.name) return "p2";
  return null;
}

function renderScoreTotals(matches) {
  const total = matches.length;
  const p1Wins = matches.filter(m => winnerKey(m.vainqueur) === "p1").length;
  const p2Wins = matches.filter(m => winnerKey(m.vainqueur) === "p2").length;
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
    byGame[m.jeu] = byGame[m.jeu] || { p1: 0, p2: 0 };
    const key = winnerKey(m.vainqueur);
    if (key) byGame[m.jeu][key] += 1;
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
    host.innerHTML = `<tr><td colspan="4" style="opacity:0.6;">Rien à afficher pour l'instant.</td></tr>`;
    return;
  }
  host.innerHTML = matches.slice().reverse().map(m => {
    const key = winnerKey(m.vainqueur);
    const winnerTag = key === "p1"
      ? `<span class="winner-tag winner-tag--p1">${m.vainqueur}</span>`
      : key === "p2"
        ? `<span class="winner-tag winner-tag--p2">${m.vainqueur}</span>`
        : m.vainqueur;
    return `
      <tr>
        <td>${m.date}</td>
        <td>${m.jeu}</td>
        <td>${winnerTag}</td>
        <td>${m.parametres || "no data"}</td>
      </tr>
    `;
  }).join("");
}
