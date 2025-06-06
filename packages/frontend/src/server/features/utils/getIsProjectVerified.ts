import type { ProjectUnverifiedContract } from '@l2beat/config'
import type { ProjectChanges } from '~/server/features/projects-change-report/getProjectsChangeReport'

export function getIsProjectVerified(
  unverifiedContracts: ProjectUnverifiedContract[],
  changes: ProjectChanges | undefined,
) {
  if (unverifiedContracts.length === 0) {
    return true
  }

  if (!changes) {
    return false
  }

  return unverifiedContracts.every((c) =>
    changes.verificationChangedContracts[c.chain]?.includes(c.address),
  )
}
