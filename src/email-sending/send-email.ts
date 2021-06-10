import { DatabaseEntry, TemplateSettings } from "../types/Models";
import { GLOBAL_SETTINGS } from "../globals";

const sendEmail = (
  candidate: DatabaseEntry,
  templateSettings: TemplateSettings,
  testing?: boolean
): boolean => {
  try {
    const testingGlobalOrLocal = GLOBAL_SETTINGS.TESTING || testing;
    // creating the email body from the template
    const prefaceTesting: string = testingGlobalOrLocal
      ? `testing mode, this email will be sent to ${
          candidate[templateSettings.keyEmail]
        }<hr>`
      : "";
    let htmlBody = prefaceTesting + templateSettings.htmlBody;
    Object.keys(candidate).forEach((key: string): void => {
      htmlBody = htmlBody.replace(`{${key}}`, candidate[key] as string);
    });
    // detecting gmail users's signature to add to the email
    const signature: string = Gmail.Users.Settings.SendAs.get(
      "me",
      GLOBAL_SETTINGS.EMAIL_EFFECTIVE_USER
    ).signature;
    // preparing the envelope
    const envelope = {
      to: testingGlobalOrLocal
        ? GLOBAL_SETTINGS.EMAIL_EFFECTIVE_USER
        : candidate[templateSettings.keyEmail] + "",
      subject: templateSettings.subject,
      htmlBody: htmlBody + `<p>${signature}</p>`,
    };
    // sending
    MailApp.sendEmail(envelope);
    return true;
  } catch (error) {
    // alerting the sender of failure in sending the email
    MailApp.sendEmail({
      to: GLOBAL_SETTINGS.EMAIL_EFFECTIVE_USER,
      subject: "error sending email",
      body:
        JSON.stringify(templateSettings, null, 2) +
        "\n" +
        JSON.stringify(error, null, 2),
    });
    return false;
  }
};
export { sendEmail };
