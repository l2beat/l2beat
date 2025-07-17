import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ProjectChanges } from '~/server/features/projects-change-report/getProjectsChangeReport'

export function getIsProjectVerified(
  becameVerifiedContracts: ChainSpecificAddress[],
  changes: ProjectChanges | undefined,
) {
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
