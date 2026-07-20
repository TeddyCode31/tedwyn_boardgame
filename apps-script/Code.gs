/* ============================================================================
   API DU REGISTRE — à coller dans Extensions > Apps Script du Google Sheet
   ============================================================================
   Ce script transforme votre Google Sheet en petite base de données que le
   site peut lire (GET) et dans laquelle il peut écrire (POST).

   Voir apps-script/INSTRUCTIONS.md pour la marche à suivre complète.
   ============================================================================ */

const SHEET_NAME = "Parties"; // nom de l'onglet du classeur contenant les données

/* Lecture : renvoie toutes les parties en JSON */
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const rows = sheet.getDataRange().getValues();
  rows.shift(); // retire la ligne d'en-tête (Date | Jeu | Paramètres | Vainqueur | Saison)

  const data = rows
    .filter(r => r[0] !== "") // ignore les lignes vides
    .map(r => ({
      date: formatCell(r[0]),
      jeu: r[1],
      parametres: r[2],
      vainqueur: r[3],
      saison: String(r[4])
    }));

  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/* Écriture : ajoute une ligne à partir du JSON envoyé par le site */
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const payload = JSON.parse(e.postData.contents);

  sheet.appendRow([
    payload.date,
    payload.jeu,
    payload.parametres,
    payload.vainqueur,
    payload.saison
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* Met les dates au format JJ/MM/AAAA plutôt qu'un objet Date brut */
function formatCell(value) {
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return value;
}
