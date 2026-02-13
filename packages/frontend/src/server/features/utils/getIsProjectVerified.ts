import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ProjectChanges } from '~/server/features/projects-change-report/getProjectsChangeReport'

const UNVERIFIED_CONTRACTS_WARNING =
  'This project contains unverified contracts.'

export function getProjectVerificationWarnings(
  becameVerifiedContracts: ChainSpecificAddress[],
  changes: ProjectChanges | undefined,
): {
  contracts: string | undefined
  programHashes: string | undefined
} {
  return {
    contracts: areContractsVerified(becameVerifiedContracts, changes)
      ? undefined
      : UNVERIFIED_CONTRACTS_WARNING,
    programHashes: undefined,
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
