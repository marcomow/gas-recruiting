const dirtyRefreshSheet: (sheet: GoogleAppsScript.Spreadsheet.Sheet) => void = (
  sheet: GoogleAppsScript.Spreadsheet.Sheet
): void => {
  // dirty fix to refresh the database's custom formula: triggering a change (so the formula is re-calculated) and waiting for the changes to be applied
  const spreadsheet = sheet.getParent();
  const dummySheet: GoogleAppsScript.Spreadsheet.Sheet =
    spreadsheet.insertSheet(); // adding a column to trigger recalculation
  spreadsheet.deleteSheet(dummySheet); // deleting the same column to avoid enlarging the sheet too much in the long run (it would cause performance issues)
  SpreadsheetApp.flush(); // waiting for the changes to be applied
};
export { dirtyRefreshSheet };
