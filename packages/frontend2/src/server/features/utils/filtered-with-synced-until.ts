import { type Layer2 } from '@l2beat/config'
import { type IndexerConfigurationRecord } from '@l2beat/database'
import { notUndefined } from '@l2beat/shared-pure'
import { toTrackedTxConfig } from '../costs/utils/to-tracked-tx-config'
import { getSyncedUntil } from './get-configurations-synced-until'

export function filteredWithSyncedUntil(
  projects: Layer2[],
  configurations: IndexerConfigurationRecord[],
) {
  return projects
    .map((project) => {
      const trackedTxConfig = toTrackedTxConfig(
        project.id,
        project.config.trackedTxs,
      )
      if (trackedTxConfig === undefined) return

      const projectRuntimeConfigIds = trackedTxConfig
        .filter((c) => c.type === 'l2costs')
        .map((c) => c.id)

      const projectConfigs = configurations.filter((c) =>
        projectRuntimeConfigIds.includes(c.id),
      )

      if (projectConfigs.length === 0) return

      const syncedUntil = getSyncedUntil(projectConfigs)
      if (!syncedUntil) return

      return {
        ...project,
        syncedUntil,
      }
    })
    .filter(notUndefined)
}
