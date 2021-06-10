import { reachEligibleCandidates } from "./email-sending/reach-eligible-candidates";

const testEmailSending = (): void => {
  reachEligibleCandidates("testing");
};
const continuousRecruiting = (): void => {
  reachEligibleCandidates("active");
};
export { testEmailSending, continuousRecruiting };
