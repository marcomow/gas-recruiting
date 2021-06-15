import { CellValue } from "./types/Models";

/**
 * @customfunction
 * @param matrixReference {range} a one-column range.
 * @param matrixImport {range} the range to import from.
 * @param indexColumnReference {number} the column of the import range where to find the match to the reference. Defaults to 0.
 * @return a matrix of matching values
 */
const CONSOLIDATE = (
  matrixReference: CellValue | CellValue[][],
  matrixImport: CellValue[][],
  indexColumnReference: number = 0,
  caseSensitive: boolean = true
) => {
  return (
    (matrixReference instanceof Array
      ? matrixReference
      : [matrixReference]) as CellValue[][]
  ).map((referenceRow: CellValue[]): CellValue[] => {
    return (
      matrixImport.find((rowImport: CellValue[]): CellValue => {
        if (caseSensitive) {
          return rowImport[indexColumnReference] === referenceRow[0];
        } else {
          return (
            ((rowImport[indexColumnReference] || "") + "").toLowerCase() ===
            ((referenceRow[0] || "") + "").toLowerCase()
          );
        }
      }) || Array.from({ length: matrixImport[0].length }).fill("")
    );
  });
};
