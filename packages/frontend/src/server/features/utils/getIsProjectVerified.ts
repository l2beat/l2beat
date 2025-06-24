import type { ProjectUnverifiedContract } from '@l2beat/config'
import type { ProjectChanges } from '~/server/features/projects-change-report/getProjectsChangeReport'

export function getIsProjectVerified(
  becameVerifiedContracts: ProjectUnverifiedContract[],
  changes: ProjectChanges | undefined,
) {
  if (becameVerifiedContracts.length === 0) {
    return true
  }

  if (!changes) {
    return false
  }

  return becameVerifiedContracts.every((c) =>
    changes.becameVerifiedContracts[c.chain]?.includes(c.address),
  )
}
