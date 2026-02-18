import type { Project } from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ProjectChanges } from '~/server/features/projects-change-report/getProjectsChangeReport'

const UNVERIFIED_CONTRACTS_WARNING =
  'This project includes unverified contracts.'

const UNSUCCESSFUL_PROGRAM_HASHES_WARNING =
  'The project relies on program hashes that could not be successfully reproduced from their published sources.'

interface ProjectVerificationWarnings {
  contracts: string | undefined
  programHashes: string | undefined
}

export function getProjectVerificationWarnings(
  project: Project<'statuses', 'contracts'>,
  changes: ProjectChanges | undefined,
): ProjectVerificationWarnings {
  return {
    contracts: areContractsVerified(
      project.statuses.unverifiedContracts,
      changes,
    )
      ? undefined
      : UNVERIFIED_CONTRACTS_WARNING,
    programHashes: project.contracts?.programHashes?.some(
      (hash) => hash.verificationStatus === 'unsuccessful',
    )
      ? UNSUCCESSFUL_PROGRAM_HASHES_WARNING
      : undefined,
  }
}

function areContractsVerified(
  becameVerifiedContracts: ChainSpecificAddress[],
  changes: ProjectChanges | undefined,
): boolean {
  if (becameVerifiedContracts.length === 0) {
    return true
  }
  if (!changes) {
    return false
  }

  return becameVerifiedContracts.every((c) => {
    const chain = ChainSpecificAddress.longChain(c)

    return changes.becameVerifiedContracts[chain]?.includes(
      ChainSpecificAddress.address(c),
    )
  })
}
