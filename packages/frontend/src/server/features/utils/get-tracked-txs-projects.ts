import type { Layer2 } from '@l2beat/config'
import type { IndexerConfigurationRecord } from '@l2beat/database'
import { notUndefined } from '@l2beat/shared-pure'
import { toTrackedTxConfig } from '../scaling/costs/utils/to-tracked-tx-config'
import { getConfigurationsSyncedUntil } from './get-configurations-synced-until'

export type TrackedTxsProject = ReturnType<typeof getTrackedTxsProjects>[number]

export function getTrackedTxsProjects(
  projects: Layer2[],
  configurations: IndexerConfigurationRecord[],
  type: 'liveness' | 'l2costs',
) {
  return projects
    .map((project) => {
      const trackedTxsConfigs = toTrackedTxConfig(
        project.id,
        project.config.trackedTxs,
      )
      if (trackedTxsConfigs === undefined) return

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
        ...project,
        trackedTxsConfigs,
        syncedUntil,
      }
    })
    .filter(notUndefined)
}
