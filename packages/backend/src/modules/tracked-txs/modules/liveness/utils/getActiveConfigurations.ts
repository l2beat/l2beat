import type { BackendProject } from '@l2beat/backend-shared'
import type {
  TrackedTxConfigEntry,
  TrackedTxLivenessConfig,
} from '@l2beat/shared'
import type { SavedConfiguration } from '@l2beat/shared-pure'
import { getSyncedUntil } from '../../../utils/getSyncedUntil'

export function getActiveConfigurations(
  project: BackendProject,
  configurations: Omit<
    SavedConfiguration<TrackedTxConfigEntry>,
    'properties'
  >[],
): TrackedTxLivenessConfig[] | undefined {
  if (project.isArchived || !project.trackedTxsConfig) {
    return undefined
  }

  const livenessConfigs = project.trackedTxsConfig.filter(
    (c) => c.type === 'liveness',
  ) as TrackedTxLivenessConfig[]

  if (!livenessConfigs.length) {
    return undefined
  }

  const livenessConfigIds = livenessConfigs.map((c) => c.id)

  const savedConfigs = configurations.filter((c) =>
    livenessConfigIds.includes(c.id),
  )

  const syncedUntil = getSyncedUntil(savedConfigs)

  if (!syncedUntil) {
    return undefined
  }

  return livenessConfigs
}
