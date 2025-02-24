import type { Project } from '@l2beat/config'
import type { IndexerConfigurationRecord } from '@l2beat/database'
import type { TrackedTxConfigEntry } from '@l2beat/shared'
import { createTrackedTxId } from '@l2beat/shared'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { getConfigurationsSyncedUntil } from './get-configurations-synced-until'

export type TrackedTxsProject = {
  id: ProjectId
  trackedTxsConfigs: TrackedTxConfigEntry[]
  syncedUntil: UnixTime
}

export function getTrackedTxsProjects(
  projects: Project<'trackedTxsConfig'>[],
  configurations: IndexerConfigurationRecord[],
  type: 'liveness' | 'l2costs',
): TrackedTxsProject[] {
  return projects
    .map((project) => {
      const trackedTxsConfigs = project.trackedTxsConfig.map((c) => ({
        ...c,
        id: createTrackedTxId(c),
      }))

      const projectRuntimeConfigIds = trackedTxsConfigs
        .filter((c) => c.type === type)
        .map((c) => c.id)

      const projectConfigs = configurations.filter((c) =>
        projectRuntimeConfigIds.includes(c.id),
      )

      if (projectConfigs.length === 0) return

      const syncedUntil = getConfigurationsSyncedUntil(projectConfigs)
      if (!syncedUntil) return

      return {
        id: project.id,
        trackedTxsConfigs,
        syncedUntil,
      }
    })
    .filter((x) => x !== undefined)
}
