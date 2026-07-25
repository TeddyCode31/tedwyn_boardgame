/* ============================================================================
   LECTURE / ÉCRITURE DANS LE GOOGLE SHEET
   ============================================================================
   Le Sheet fait office de base de données. Une "partie" a la forme :
   { date, jeu, parametres, vainqueur, saison }
   ============================================================================ */

function isSheetConfigured() {
  return typeof SHEET_WEBAPP_URL === "string" &&
         SHEET_WEBAPP_URL.length > 0 &&
         !SHEET_WEBAPP_URL.startsWith("COLLEZ_ICI");
}

async function fetchMatchesFromSheet() {
  const res = await fetch(SHEET_WEBAPP_URL, { method: "GET" });
  if (!res.ok) {
    const body = await safeText(res);
    throw new Error(`Le Google Sheet a répondu avec une erreur (statut ${res.status}). ${body}`);
  }
  return res.json();
}

async function postMatchToSheet(match) {
  // Sur l'écriture, Google Apps Script ne renvoie pas toujours les en-têtes
  // CORS attendus par le navigateur, ce qui provoque un "Failed to fetch"
  // même quand l'enregistrement a réussi côté serveur. On envoie donc la
  // requête en mode "no-cors" (réponse illisible, mais l'écriture passe),
  // et c'est la relecture (GET) juste après qui confirme que ça a marché.
  try {
    await fetch(SHEET_WEBAPP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(match)
    });
  } catch (err) {
    throw new Error("La requête n'a pas pu être envoyée (réseau, ou URL de déploiement incorrecte). " + err.message);
  }
}

async function safeText(res) {
  try {
    const t = await res.text();
    // Google renvoie parfois une page HTML d'erreur : on la raccourcit
    return t.replace(/\s+/g, " ").slice(0, 180);
  } catch {
    return "";
  }
}
