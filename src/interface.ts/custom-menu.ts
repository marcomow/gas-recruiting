import { GLOBAL_SETTINGS } from "../globals";

const onOpen: (event: GoogleAppsScript.Events.SheetsOnOpen) => void = (
  event: GoogleAppsScript.Events.SheetsOnOpen
) => {
  const menuTesting = SpreadsheetApp.getUi()
    .createMenu("testing")
    .addItem("test templates", "testEmailSending");
  const menuProduction = SpreadsheetApp.getUi()
    .createMenu("triggers")
    .addItem(
      "manually trigger recruitment emails to candidates",
      GLOBAL_SETTINGS.TRIGGER_FUNCTION_NAME
    )
    .addItem("create/renew time trigger", "createCRTrigger")
    .addItem("delete CR triggers", "deleteAllCRTriggers");
  const menu = SpreadsheetApp.getUi()
    .createMenu("Continuous Recruitment")
    .addSubMenu(menuTesting)
    .addSubMenu(menuProduction)
    .addToUi();
};
export { onOpen };
