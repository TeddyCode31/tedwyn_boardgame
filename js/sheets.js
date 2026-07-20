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
  if (!res.ok) throw new Error("Le Google Sheet n'a pas répondu correctement.");
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
  if (!res.ok) throw new Error("L'enregistrement dans le Google Sheet a échoué.");
  return res.json();
}
