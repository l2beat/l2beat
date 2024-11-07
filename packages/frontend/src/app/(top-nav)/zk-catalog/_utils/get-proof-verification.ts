import { type OnchainVerifier, type ProofVerification } from '@l2beat/config'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { type VerifiersStatuses } from '~/server/features/zk-catalog/get-verifiers'
import { type Project, type ZkCatalogProofVerification } from './types'

export function getProofVerification(
  project: Project,
  verifiersStatuses: VerifiersStatuses,
): ZkCatalogProofVerification {
  let proofVerification: ProofVerification

  if (project.type === 'zk-catalog') {
    proofVerification = project.proofVerification
  } else {
    assert(project.stateValidation?.proofVerification, 'Invalid project')
    proofVerification = project.stateValidation.proofVerification
  }

  return {
    ...proofVerification,
    shortDescription: proofVerification.shortDescription,
    verifiers: proofVerification.verifiers.map((verifier) => ({
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
  const days = Math.floor(
    (UnixTime.now().toNumber() - timestamp.toNumber()) / secondsInDay,
  )

  return days
}
