import { CellValue, ContainerConditionEvaluations } from "../types/Models";

// a container so the evaluation functions can be called dynamically
const conditionEvaluations: ContainerConditionEvaluations = {
  value: (value: CellValue, expectedValue: CellValue): boolean => {
    // if an expected value is specified a strict stringified comparison is evaluated; otherwise it's enough for the value to exist/not being falsy
    return expectedValue ? value + "" === expectedValue + "" : !!value;
  },
  instance: (value: CellValue, expectedValue: CellValue): boolean => {
    const instanceName = expectedValue + "";
    if (instanceName.match(/^[A-Z][a-z]+/)?.[0] !== instanceName) {
      throw new Error(
        `the instance name '${instanceName}' should start with a capital letter followed by lowercase letters, without any other character than alphabetic ones.`
      );
    }
    // with the check above we ensure that expectedValue content is safe to eval
    return value instanceof eval(instanceName);
  },
  greater: (value: CellValue, expectedValue: CellValue): boolean => {
    const value_: number | Error =
      value instanceof Date ? value.getTime() : Number(value);
    const expectedValue_: number | Error = Number(expectedValue);
    if (!valuesAreNumbers(value_, expectedValue_)) {
      return false;
    }
    return value_ > expectedValue_;
  },
  lower: (value: CellValue, expectedValue: CellValue): boolean => {
    const value_: number | Error =
      value instanceof Date ? value.getTime() : Number(value);
    const expectedValue_: number | Error = Number(expectedValue);
    if (!valuesAreNumbers(value_, expectedValue_)) {
      return false;
    }
    return value_ < expectedValue_;
  },
  sender_email: (value: CellValue, expectedValue: CellValue): boolean => {
    return expectedValue === Session.getEffectiveUser().getEmail();
  },
};
const valuesAreNumbers = (
  value: CellValue,
  expectedValue: CellValue
): boolean => {
  const valuesNotNumbers: CellValue[] = [value, expectedValue].filter(
    (v: CellValue): boolean => !v
  );
  const checkNotPassed: boolean = valuesNotNumbers.length > 0;
  // TODO improve error handling
  if (checkNotPassed) {
    console.warn(
      `input not matching Number signature: ${valuesNotNumbers.join(",")}`
    );
  }
  return !checkNotPassed;
};
export { conditionEvaluations };
