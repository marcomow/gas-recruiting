import {
  CellValue,
  DatabaseEntry,
  ConditionType,
  TemplateSettings,
} from "../types/Models";
import { conditionEvaluations } from "./condition-evaluation";

const messageConditionMalformed = (conditionString: string): string =>
  `header for condition ${conditionString} is malformed, shoud be condition:conditionType:inverter`;
const conditionTypes: ConditionType[] = [
  "value",
  "instance",
  "greater",
  "lower",
  "sender_email",
];

const filterCandidates = (
  entries: DatabaseEntry[],
  templateSettings: TemplateSettings
): DatabaseEntry[] => {
  // filtering the candidates for whom should be sent an email
  const filteredCandidates: DatabaseEntry[] = entries.filter(
    (entry: DatabaseEntry): boolean => {
      // collecting the properties referring to a condition
      const keysConditions: string[] = Object.keys(templateSettings).filter(
        (key: string): boolean => key.startsWith("condition:")
      );
      // all the conditions should be valid for the email to be sent for this candidate
      const allConditionsSatisfied: boolean = keysConditions.every(
        (conditionString: string): boolean => {
          // each condition property is declared by a header in the form condition:conditionType:inverter
          const conditionElements: string[] = conditionString.split(":");
          // throwing error if the header is malformed
          if (conditionElements.length !== 3) {
            throw new Error(messageConditionMalformed(conditionString));
          }
          //@ts-ignore we are checking at runtime that is 3 parts
          const [_c, conditionType, inverter]: [string, ConditionType, string] =
            conditionElements;
          // the condition type will route the condition evaluation to a specific function
          if (!conditionTypes.includes(conditionType)) {
            throw new Error(messageConditionMalformed(conditionString));
          }
          // the inverter condition will reverse the condition, it must be set up with a true or false flag
          if (!["true", "false"].includes(inverter)) {
            throw new Error(
              `the inverter value for a condition ${conditionString} must be 'true' or 'false', but here was specified ${inverter}`
            );
          }
          const inverted = inverter === "false";
          // each condition value contains a string of ids corresponding to entry/candidate's properties
          const conditionIds: string[] = (
            templateSettings[conditionString] + ""
          )
            .split(",")
            .filter((a: string): boolean => a !== "");
          // if there are no conditions to be checked, the condition is ignored
          if (conditionIds.length === 0) {
            return true;
          }
          // all the ids are evaluated by the corresponding entry's value and the condition's value, in different ways according to their condition type; all off them have to evaluate truthy
          const allValuesMatching: boolean = conditionIds.every(
            (conditionId: string): boolean => {
              const expectedValue: string | undefined =
                conditionId.match(/\(([^)]+)\)/)?.[1];
              const propertyId: string = conditionId.replace(/\(([^)]+)\)/, "");
              const entryPropertyValue: CellValue = entry[propertyId];
              // accessing dynamically the condition evaluation function
              const conditionEvaluation: boolean = conditionEvaluations[
                conditionType
              ](entryPropertyValue, expectedValue);
              const evaluationAfterEventualInversion: boolean = inverted
                ? !conditionEvaluation
                : conditionEvaluation;
              return evaluationAfterEventualInversion;
            }
          );
          return allValuesMatching;
        }
      );
      return allConditionsSatisfied;
    }
  );
  if (templateSettings["slice"]) {
    const amountSlice: number = Number(templateSettings["slice"]);
    if (!amountSlice) {
      console.warn(
        `the value "${templateSettings["slice"]}" of the template "${templateSettings.id}" for funnel "${templateSettings.funnel.name}" is not a number; slice has been ignored`
      );
    } else {
      return filteredCandidates.slice(0, amountSlice);
    }
  }
  return filteredCandidates;
};
export { filterCandidates };
