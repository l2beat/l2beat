import { TrackedTxConfigEntry } from '@l2beat/shared'
import { Project } from '../../../../../model/Project'
import { SavedConfiguration } from '../../../../../tools/uif/multi/types'
import { getSyncedUntil } from '../../utils/getSyncedUntil'

export function getProjectsToSync(
  projects: Project[],
  configurations: Omit<
    SavedConfiguration<TrackedTxConfigEntry>,
    'properties'
  >[],
): Project[] {
  return projects.filter((p) => {
    if (p.isArchived || !p.trackedTxsConfig) {
      return false
    }

    const projectRuntimeConfigIds = p.trackedTxsConfig
      .filter((c) => c.type === 'liveness')
      .map((c) => c.id)
    const projectConfigs = configurations.filter((c) =>
      projectRuntimeConfigIds.includes(c.id),
    )

    if (projectConfigs.length === 0) {
      return false
    }

    const syncedUntil = getSyncedUntil(projectConfigs)

    if (!syncedUntil) {
      return false
    }

    return true
  })
}
