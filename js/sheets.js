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
  // Content-Type "text/plain" évite la requête de pré-vol CORS que
  // Google Apps Script ne sait pas toujours gérer.
  const res = await fetch(SHEET_WEBAPP_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(match)
  });
  if (!res.ok) {
    const body = await safeText(res);
    throw new Error(`Le Google Sheet a refusé l'écriture (statut ${res.status}). ${body}`);
  }
  return res.json();
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
