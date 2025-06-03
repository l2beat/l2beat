export type VerificationStatus =
  | './Verified'
  | './Unverified'
  | 'not-verifiable'

export function toVerificationStatus(
  verified: boolean | undefined,
): VerificationStatus {
  if (verified === false) {
    return './Unverified'
  }
  if (verified === true) {
    return './Verified'
  }
  return 'not-verifiable'
}
