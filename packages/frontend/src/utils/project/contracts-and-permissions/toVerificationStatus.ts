export type VerificationStatus =
  | 'verified'
  | 'unverified'
  | 'not-verifiable'
  | 'became-verified'

export function toVerificationStatus(
  verified: boolean | undefined,
  becameVerified: boolean | undefined,
): VerificationStatus {
  if (becameVerified) {
    return 'became-verified'
  }
  if (verified === false) {
    return 'unverified'
  }
  if (verified === true) {
    return 'verified'
  }
  return 'not-verifiable'
}
