/* ============================================================================
   TIRAGE — page index.html
   ============================================================================
   Principe : au clic sur "Tirer la soirée", on construit une chaîne de fiches
   (le jeu, puis chacun de ses paramètres) et on les fait défiler une par une,
   comme une fiche que l'on pioche dans un tiroir, avant de se figer sur le
   résultat. Le tirage final est enregistré automatiquement dans le navigateur
   (aucune action supplémentaire nécessaire) pour être récupéré sur la page
   Registre.
   ============================================================================ */

const chainEl = document.getElementById("chain");
const drawBtn = document.getElementById("drawBtn");
const drawStatus = document.getElementById("drawStatus");
const summarySection = document.getElementById("resultSummary");

let isDrawing = false;

drawBtn.addEventListener("click", startDraw);

function startDraw() {
  if (isDrawing) return;
  isDrawing = true;
  drawBtn.disabled = true;
  drawStatus.textContent = "Tirage en cours…";
  summarySection.hidden = true;
  summarySection.innerHTML = "";
  chainEl.innerHTML = "";

  // 1. On choisit le jeu au hasard, probabilité égale entre tous les jeux
  const game = GAMES[Math.floor(Math.random() * GAMES.length)];

  // 2. On construit la liste des tirages à effectuer : le jeu, puis chaque paramètre
  const steps = [
    { kind: "game", label: "Le jeu de ce soir", candidates: GAMES.map(g => g.name), result: game.name }
  ];
  game.parameters.forEach(param => {
    const candidates = param.type === "boolean" ? ["Oui", "Non"] : param.options;
    const result = candidates[Math.floor(Math.random() * candidates.length)];
    steps.push({ kind: "param", label: param.label, candidates, result, paramId: param.id });
  });

  // 3. On crée les fiches (une par étape), toutes en attente au départ
  const cardEls = steps.map((step, i) => createChainItem(step, i));
  cardEls.forEach(el => chainEl.appendChild(el.li));

  // 4. On les fait défiler l'une après l'autre
  runSequence(steps, cardEls, 0, () => {
    isDrawing = false;
    drawBtn.disabled = false;
    drawBtn.textContent = "Retirer la soirée";
    drawStatus.textContent = "Tirage enregistré — direction le registre pour noter le résultat.";
    showSummary(game, steps);
    savePendingDrawFromSteps(game, steps);
  });
}

function createChainItem(step, index) {
  const li = document.createElement("li");
  li.className = "chain__item";
  li.dataset.state = index === 0 ? "active" : "pending";

  const rail = document.createElement("div");
  rail.className = "chain__rail";
  const pin = document.createElement("div");
  pin.className = "chain__pin";
  rail.appendChild(pin);

  const card = document.createElement("div");
  card.className = "index-card chain__card";
  card.innerHTML = `
    <p class="index-card__eyebrow">${step.label}</p>
    <p class="index-card__title is-cycling">—</p>
  `;

  li.appendChild(rail);
  li.appendChild(card);
  return { li, titleEl: card.querySelector(".index-card__title") };
}

function runSequence(steps, cardEls, i, onFinished) {
  if (i >= steps.length) { onFinished(); return; }
  const step = steps[i];
  const { li } = { li: chainEl.children[i] };
  li.dataset.state = "active";
  const titleEl = cardEls[i].titleEl;

  cycleThenLand(titleEl, step.candidates, step.result, () => {
    li.dataset.state = "done";
    if (i + 1 < steps.length) chainEl.children[i + 1].dataset.state = "active";
    runSequence(steps, cardEls, i + 1, onFinished);
  });
}

/* Fait défiler rapidement les candidats dans la fiche, en ralentissant,
   puis se fige sur la valeur finale. */
function cycleThenLand(titleEl, candidates, finalValue, onLanded) {
  const totalDuration = 900;
  const start = performance.now();
  let lastTick = 0;

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / totalDuration, 1);
    // délai croissant entre deux changements (accélère puis ralentit)
    const interval = 45 + Math.pow(progress, 2) * 220;

    if (now - lastTick > interval) {
      lastTick = now;
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      titleEl.textContent = pick;
    }

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      titleEl.textContent = finalValue;
      titleEl.classList.remove("is-cycling");
      onLanded();
    }
  }
  requestAnimationFrame(tick);
}

function showSummary(game, steps) {
  const paramSteps = steps.slice(1);
  const paramsList = paramSteps.length
    ? paramSteps.map(s => `<li>${s.label} : <strong>${s.result}</strong></li>`).join("")
    : `<li>Aucun réglage pour ce jeu — installez le plateau tel quel.</li>`;

  summarySection.hidden = false;
  summarySection.innerHTML = `
    <div class="result-summary__photo">
      <img class="game-photo" alt="${game.name}"
           src="images/games/${game.id}.jpg"
           onerror="this.onerror=null;this.src='images/games/_placeholder.svg';">
    </div>
    <div class="result-summary__body">
      <p class="index-card__eyebrow">Ce soir, on joue à</p>
      <h2 class="index-card__title" style="font-size:2rem;color:var(--card);">${game.name}</h2>
      <ul class="pending-card__params" style="color:rgba(242,233,211,0.75);list-style:none;padding:0;margin:14px 0 0;">
        ${paramsList}
      </ul>
      <div class="stamp">Tirage enregistré</div>
      <div class="result-actions">
        <a class="btn btn--solid" href="scores.html">Aller au registre →</a>
        <button class="btn btn--ghost" id="redrawBtn" type="button">Retirer</button>
      </div>
    </div>
  `;
  document.getElementById("redrawBtn").addEventListener("click", startDraw);
}

function savePendingDrawFromSteps(game, steps) {
  const params = {};
  steps.slice(1).forEach(s => { params[s.label] = s.result; });
  savePendingDraw({
    gameId: game.id,
    gameName: game.name,
    params,
    drawnAt: new Date().toISOString()
  });
}
