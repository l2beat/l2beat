export type VerificationStatus = 'verified' | 'unverified' | 'not-verifiable'

export function toVerificationStatus(
  verified: boolean | undefined,
): VerificationStatus {
  if (verified === false) {
    return 'unverified'
  }
  if (verified === true) {
    return 'verified'
  }
  return 'not-verifiable'
}
