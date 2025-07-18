import type { OnchainVerifier, Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import type { VerifiersStatuses } from '~/server/features/zk-catalog/getVerifiers'
import type { ZkCatalogProofVerification } from './types'

export function getProofVerification(
  project: Project<'proofVerification'>,
  verifiersStatuses: VerifiersStatuses,
): ZkCatalogProofVerification {
  return {
    ...project.proofVerification,
    shortDescription: project.proofVerification.shortDescription,
    verifiers: project.proofVerification.verifiers.map((verifier) => ({
      ...verifier,
      lastUsedDaysAgo: getVerifierLastUsedDaysAgo(verifier, verifiersStatuses),
    })),
  }
}

function getVerifierLastUsedDaysAgo(
  verifier: OnchainVerifier,
  verifiersStatuses: VerifiersStatuses,
): number | undefined {
  const timestamp = verifiersStatuses.find(
    (entry) => entry.address === verifier.contractAddress.toString(),
  )?.timestamp

  if (!timestamp) {
    return undefined
  }

  const secondsInDay = 60 * 60 * 24
  const days = Math.floor((UnixTime.now() - timestamp) / secondsInDay)

  return days
}
