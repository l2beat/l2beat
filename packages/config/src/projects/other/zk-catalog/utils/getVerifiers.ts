import { zkCatalogProjects } from '..'
import { layer2s } from '../../../layer2s'
import { OnchainVerifier } from '../../../types'

export type VerifiersListProvider = () => OnchainVerifier[]

export function getVerifiersFromConfig(): OnchainVerifier[] {
  const verifiers: OnchainVerifier[] = []

  layer2s.forEach((l2) => {
    if (l2.stateValidation?.proofVerification) {
      verifiers.push(...l2.stateValidation.proofVerification.verifiers)
    }
  })

  zkCatalogProjects.forEach((zk) => {
    verifiers.push(...zk.proofVerification.verifiers)
  })

  return verifiers
}
