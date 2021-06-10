import { GLOBAL_SETTINGS } from "../globals";
import { deleteAllCRTriggers } from "./delete-triggers";

const createCRTrigger = (): void => {
  deleteAllCRTriggers();
  ScriptApp.newTrigger(GLOBAL_SETTINGS.TRIGGER_FUNCTION_NAME)
    .timeBased()
    .everyHours(1)
    .create();
};
export { createCRTrigger };
