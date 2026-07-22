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
  programHashesDescription: string | undefined
}

export function getProjectVerificationWarnings(
  project: Project<'statuses', 'contracts'>,
  changes: ProjectChanges | undefined,
): ProjectVerificationWarnings {
  const unverifiedContracts = getUnresolvedUnverifiedContracts(
    project.statuses.unverifiedContracts,
    changes,
  )

  return {
    contracts:
      unverifiedContracts.length === 0
        ? undefined
        : UNVERIFIED_CONTRACTS_WARNING,
    programHashes: project.contracts?.programHashes?.some(
      (hash) => hash.verificationStatus === 'unsuccessful',
    )
      ? UNSUCCESSFUL_PROGRAM_HASHES_WARNING
      : undefined,
    programHashesDescription: project.contracts?.programHashes?.some(
      (hash) => hash.verificationStatus === 'unsuccessful',
    )
      ? project.contracts?.programHashesDescription
      : undefined,
  }
}

export function getUnresolvedUnverifiedContracts(
  unverifiedContracts: ChainSpecificAddress[],
  changes: ProjectChanges | undefined,
): ChainSpecificAddress[] {
  if (!changes) {
    return unverifiedContracts
  }

  return unverifiedContracts.filter((contract) => {
    const chain = ChainSpecificAddress.longChain(contract)

    return !changes.becameVerifiedContracts[chain]?.includes(
      ChainSpecificAddress.address(contract),
    )
  })
}
