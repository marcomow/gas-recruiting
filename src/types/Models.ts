export type CellValue =
  | string
  | number
  | boolean
  | Date
  | GoogleAppsScript.Sheets.Schema.ErrorValue;
export type DatabaseId = { id: string; _column: string };
export type DatabaseEntry = { [id: string]: CellValue };
export type SheetDatabase = { ids: DatabaseId[]; buffer: DatabaseEntry[] };
export type CandidatesFilter = (
  arrayCandidates: DatabaseEntry[]
) => DatabaseEntry[];
export type TemplateSettings = {
  id: string;
  funnel: Funnel;
  idEmailRecipient: string;
  idColumnUpdate: string;
  valueUpdate: CellValue;
  subject: string;
  htmlBody: string;
  keyEmail: string;
  status: TemplateStatus;
};
export type ConditionType =
  | "value"
  | "instance"
  | "greater"
  | "lower"
  | "sender_email";
export type ConditionEvaluationFunction = (
  value: CellValue,
  expectedValue: CellValue
) => boolean;
export type ContainerConditionEvaluations = {
  [a in ConditionType]: ConditionEvaluationFunction;
};
export interface ConditionEvaluationInput {
  value: CellValue;
  expectedValue: CellValue;
}
export interface Funnel {
  name: string;
  spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  database: SheetDatabase;
}
export type TemplateStatus = "active" | "testing" | "setup";
