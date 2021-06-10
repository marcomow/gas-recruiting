import { TemplateSettings, DatabaseEntry } from "../types/Models";
import { sendEmail } from "./send-email";
import { filterCandidates } from "./filter-candidates";

const routineEmailSending = (templateSettings: TemplateSettings): void => {
  const funnel = templateSettings.funnel;
  const candidatesDatabase = funnel.database;
  const candidates = candidatesDatabase.buffer;
  // filtering candidates eligible to receive this specific email
  const candidatesToReach: DatabaseEntry[] = filterCandidates(
    candidates,
    templateSettings
  );
  // sending an email to the eligible candidates
  const candidatesReached: DatabaseEntry[] = candidatesToReach.filter(
    (candidate) =>
      sendEmail(
        candidate,
        templateSettings,
        templateSettings.status === "testing"
      )
  );
  // marking in the database the sending of this email
  if (candidatesReached.length > 0) {
    const letterColumnUpdate: string = candidatesDatabase.ids.find(
      (id) => id.id === templateSettings.idColumnUpdate
    )?._column;
    if (letterColumnUpdate) {
      const rangesUpdate = candidatesReached.map(
        (candidate) => letterColumnUpdate + candidate._indexRow
      );
      funnel.sheet
        .getRangeList(rangesUpdate)
        .setValue(templateSettings.valueUpdate);
    }
  }
};
export { routineEmailSending };
