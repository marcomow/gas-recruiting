import { SHEET_SETTINGS } from "../GLOBALS";
import {
  DatabaseEntry,
  TemplateSettings,
  Funnel,
  SheetDatabase,
  TemplateStatus,
} from "../types/Models";
import { reduceSheetToDatabase } from "../utilities/reduce-sheet-to-database";
import { routineEmailSending } from "./routine-email-sending";

const reachEligibleCandidates = (templateStatus: TemplateStatus) => {
  // collecting the funnels references first to reduce the number of calls
  const dashboardSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet =
    SpreadsheetApp.getActiveSpreadsheet();
  const dashboardSheet: GoogleAppsScript.Spreadsheet.Sheet =
    dashboardSpreadsheet.getSheetByName(SHEET_SETTINGS.SHEET_FUNNELS_NAME);
  const funnelsDatabase: SheetDatabase = reduceSheetToDatabase(dashboardSheet);
  //TODO add check if funnel ids are set up properly funnelsDatabase.ids
  const funnels: Funnel[] = funnelsDatabase.buffer
    .filter((entry: DatabaseEntry): boolean => !!entry["active"])
    .map((entry: DatabaseEntry): Funnel => {
      const spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet =
        SpreadsheetApp.openByUrl(entry["spreadsheet"] as string);
      const sheet: GoogleAppsScript.Spreadsheet.Sheet =
        spreadsheet.getSheetByName(entry["name_sheet_master"] as string);
      // dirty fix to refresh the database's custom formula
      sheet.appendRow([[""]]);
      SpreadsheetApp.flush();
      const offsetTop: number = Number(entry["offset_rows"]);
      // TODO add error handling for wrong setup // if(isNaN(offsetTop)){}
      const database: SheetDatabase = reduceSheetToDatabase(sheet, offsetTop);
      const funnel: Funnel = {
        name: entry["name"] as string,
        spreadsheet,
        sheet,
        database,
      };
      return funnel;
    });
  // collecting all the template settings
  const templateSettingsSheet: GoogleAppsScript.Spreadsheet.Sheet =
    dashboardSpreadsheet.getSheetByName(
      SHEET_SETTINGS.SHEET_TEMPLATE_SETTINGS_NAME
    );
  const templateSettingsDatabase: SheetDatabase = reduceSheetToDatabase(
    templateSettingsSheet
  );
  //TODO add check if template ids are set up properly //if(templateSettingsDatabase.ids ){}
  const templateSettingsAll: TemplateSettings[] =
    templateSettingsDatabase.buffer
      .filter(
        (entry: DatabaseEntry): boolean => entry["status"] === templateStatus
      )
      .map((entry: DatabaseEntry): TemplateSettings => {
        const funnel: Funnel = funnels.find(
          (funnel: Funnel): boolean => funnel.name === entry["funnel_name"]
        ); // TODO add error handling NB this should not break the process for valid setups // if (!funnel) { throw new Error(``); }
        const templateSettings: TemplateSettings = {
          funnel,
          id: entry["id"] + "",
          idColumnUpdate: entry["id_column_update"] + "",
          idEmailRecipient: entry["id_email_recipient"] + "",
          valueUpdate: entry["value_update"],
          status: entry["status"] as TemplateStatus,
          subject: entry["subject"] + "",
          htmlBody: entry["html_body"] + "",
          keyEmail: entry["id_email_recipient"] + "",
          ...entry,
        }; // TODO add error handling for properties NB this should not break the process for valid setups // if (!property)
        return templateSettings;
      });
  // running the routine for all the valid template settings
  templateSettingsAll.forEach(routineEmailSending);
};
export { reachEligibleCandidates };
