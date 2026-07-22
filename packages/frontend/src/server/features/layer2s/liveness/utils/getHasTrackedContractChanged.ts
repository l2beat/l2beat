import type { Project } from '@l2beat/config'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'

export function getHasTrackedContractChanged(
  project: Project<'trackedTxsConfig'>,
  projectChangeReport: ProjectsChangeReport['projects'][string] | undefined,
): boolean {
  const addressesChanged = projectChangeReport?.ethereum?.implementationChange
  if (!addressesChanged || addressesChanged.length === 0) return false

  return project.trackedTxsConfig.some((config) => {
    switch (config.params.formula) {
      case 'functionCall':
      case 'sharedBridge':
      case 'sharpSubmission':
        return addressesChanged.includes(config.params.address)
      case 'transfer':
        return (
          (config.params.from
            ? addressesChanged.includes(config.params.from)
            : false) || addressesChanged.includes(config.params.to)
        )
    }
  })
}
