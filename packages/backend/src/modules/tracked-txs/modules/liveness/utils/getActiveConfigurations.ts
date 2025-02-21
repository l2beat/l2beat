import type {
  TrackedTxConfigEntry,
  TrackedTxLivenessConfig,
} from '@l2beat/shared'
import type { SavedConfiguration } from '@l2beat/shared-pure'
import { getSyncedUntil } from '../../../utils/getSyncedUntil'
import type { TrackedTxProject } from '../../../../../config/Config'

export function getActiveConfigurations(
  project: TrackedTxProject,
  configurations: Omit<
    SavedConfiguration<TrackedTxConfigEntry>,
    'properties'
  >[],
): TrackedTxLivenessConfig[] | undefined {
  if (project.isArchived) {
    return undefined
  }

  const livenessConfigs = project.configurations.filter(
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
