import type { ProjectUnverifiedContract } from '@l2beat/config'
import type { ProjectChanges } from '~/server/features/projects-change-report/getProjectsChangeReport'

export function getIsProjectVerified(
  unverifiedContracts: ProjectUnverifiedContract[],
  changes: ProjectChanges | undefined,
) {
  if (!changes) {
    return true
  }

  return unverifiedContracts.every((c) =>
    changes?.verificationChangedContracts[c.chain]?.includes(c.address),
  )
}
