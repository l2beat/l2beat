import { Project } from '../../../../../model/Project'
import { getLivenessTrackedTxsConfig } from './getLivenessTrackedTxsConfig'

export function getProjectsToSync(projects: Project[]): Project[] {
  return projects.filter((p) => {
    if (p.isArchived || !p.trackedTxsConfig) {
      return false
    }

    const livenessConfig = getLivenessTrackedTxsConfig(p.trackedTxsConfig)

    if (livenessConfig.entries?.length === 0) {
      return false
    }

    return true
  })
}
