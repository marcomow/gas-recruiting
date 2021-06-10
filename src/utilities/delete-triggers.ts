import { GLOBAL_SETTINGS } from "../globals";

const deleteAllCRTriggers = (): void => {
  const triggers: GoogleAppsScript.Script.Trigger[] =
    ScriptApp.getProjectTriggers();
  triggers
    .filter(
      (trigger: GoogleAppsScript.Script.Trigger): boolean =>
        trigger.getHandlerFunction() === GLOBAL_SETTINGS.TRIGGER_FUNCTION_NAME
    )
    .forEach((trigger: GoogleAppsScript.Script.Trigger): void =>
      ScriptApp.deleteTrigger(trigger)
    );
};
export { deleteAllCRTriggers };
