/**
 * @customfunction
 * @param matrixReference {range} a one-column range.
 * @param matrixImport {range} the range to import from.
 * @param indexColumnReference {number} the column of the import range where to find the match to the reference. Defaults to 0.
 * @return a matrix of matching values
 */
const CONSOLIDATE = (
  matrixReference: any | any[][],
  matrixImport: any[][],
  indexColumnReference: number = 0
) => {
  return (
    matrixReference instanceof Array ? matrixReference : [matrixReference]
  ).map((referenceRow: any[]): any[] => {
    return (
      matrixImport.find((rowImport: any[]): any => {
        return rowImport[indexColumnReference] === referenceRow[0];
      }) || Array.from({ length: matrixImport[0].length }).fill("")
    );
  });
};
