import type { ZkCatalogOnchainVerifier } from './types'

export type TrustedSetup = 'Yes' | 'No' | '?'

export function getTrustedSetup(verifiers: ZkCatalogOnchainVerifier[]) {
  const allUndefined = verifiers.every((verifier) =>
    verifier.subVerifiers.every((subVerifier) => !subVerifier.trustedSetup),
  )
  if (allUndefined) {
    return '?'
  }
  const anyDefined = verifiers.some((verifier) =>
    verifier.subVerifiers.some(
      (subVerifier) =>
        !!subVerifier.trustedSetup && subVerifier.trustedSetup !== 'None',
    ),
  )
  if (anyDefined) {
    return 'Yes'
  }
  return 'No'
}
