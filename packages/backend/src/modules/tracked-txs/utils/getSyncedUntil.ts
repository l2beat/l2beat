import { TrackedTxConfigEntry } from '@l2beat/shared'
import { SavedConfiguration, UnixTime } from '@l2beat/shared-pure'
import { partition } from 'lodash'

export function getSyncedUntil(
  configurations: Omit<
    SavedConfiguration<TrackedTxConfigEntry>,
    'properties'
  >[],
): UnixTime | undefined {
  if (configurations.length === 0) {
    return undefined
  }

  const [configsWithoutUntil, configsWithUntil] = partition(
    configurations,
    (c) => c.maxHeight === null,
  )

  const configsToUse =
    configsWithoutUntil.length !== 0 &&
    configsWithoutUntil.some((c) => c.currentHeight !== null)
      ? configsWithoutUntil
      : configsWithUntil

  const lastSyncedTimestamps = configsToUse
    .map((c) => c.currentHeight)
    .filter((height): height is number => height !== null)

  if (lastSyncedTimestamps.length === 0) {
    return undefined
  }

  const syncedUntil = Math.min(...lastSyncedTimestamps)
  return new UnixTime(syncedUntil)
}
