import { TrackedTxConfigEntry } from '@l2beat/shared'
import { SavedConfiguration } from '../../../../../tools/uif/multi/types'
import { getSyncedUntil } from '../../utils/getSyncedUntil'
import { BackendProject } from '@l2beat/config'

export function getProjectsToSync(
  projects: BackendProject[],
  configurations: Omit<
    SavedConfiguration<TrackedTxConfigEntry>,
    'properties'
  >[],
): BackendProject[] {
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
