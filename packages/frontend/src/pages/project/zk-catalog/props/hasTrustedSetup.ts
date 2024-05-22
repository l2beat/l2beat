import { ZkCatalogProjectDetails } from '../view/ZkCatalogProjectPage'

export function hasTrustedSetup(
  verifiers: ZkCatalogProjectDetails['verifiers'],
) {
  return verifiers.some((verifier) =>
    verifier.subVerifiers.some((subVerifier) => !!subVerifier.trustedSetup),
  )
}
