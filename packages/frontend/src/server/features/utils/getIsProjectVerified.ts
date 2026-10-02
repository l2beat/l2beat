import type { Project } from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { PROJECT_UNVERIFIED_CONTRACTS_WARNING } from '~/components/projects/sections/sectionCopy'
import type { ProjectChanges } from '~/server/features/projects-change-report/getProjectsChangeReport'
import type { ProjectVerificationWarnings } from './getCommonProjectEntry'

const UNSUCCESSFUL_PROGRAM_HASHES_WARNING =
  'The project relies on program hashes that could not be successfully reproduced from their published sources.'

export function getProjectVerification(
  project: Project<'statuses', 'contracts'>,
  changes: ProjectChanges | undefined,
): {
  warnings: ProjectVerificationWarnings
  unverifiedContracts: ChainSpecificAddress[]
} {
  const unverifiedContracts = getUnverifiedContracts(
    project.statuses.unverifiedContracts,
    changes,
  )
  const hasUnsuccessfulProgramHashes = project.contracts?.programHashes?.some(
    (hash) => hash.verificationStatus === 'unsuccessful',
  )

  return {
    warnings: {
      contracts:
        unverifiedContracts.length === 0
          ? undefined
          : PROJECT_UNVERIFIED_CONTRACTS_WARNING,
      programHashes: hasUnsuccessfulProgramHashes
        ? UNSUCCESSFUL_PROGRAM_HASHES_WARNING
        : undefined,
      programHashesDescription: hasUnsuccessfulProgramHashes
        ? project.contracts?.programHashesDescription
        : undefined,
    },
    unverifiedContracts,
  }
}

function getUnverifiedContracts(
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
