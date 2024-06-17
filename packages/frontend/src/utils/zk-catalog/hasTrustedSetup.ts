import { ZkCatalogOnchainVerifier } from './types'

export function hasTrustedSetup(verifiers: ZkCatalogOnchainVerifier[]) {
  return verifiers.some((verifier) =>
    verifier.subVerifiers.some(
      (subVerifier) =>
        !!subVerifier.trustedSetup && subVerifier.trustedSetup !== 'None',
    ),
  )
}
