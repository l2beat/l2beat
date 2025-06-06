export type VerificationStatus =
  | 'verified'
  | 'unverified'
  | 'not-verifiable'
  | 'verification-change'

export function toVerificationStatus(
  verified: boolean | undefined,
  verificationChange: boolean | undefined,
): VerificationStatus {
  if (verificationChange) {
    return 'verification-change'
  }
  if (verified === false) {
    return 'unverified'
  }
  if (verified === true) {
    return 'verified'
  }
  return 'not-verifiable'
}
