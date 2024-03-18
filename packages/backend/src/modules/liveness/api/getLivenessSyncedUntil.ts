import { notUndefined, UnixTime } from '@l2beat/shared-pure'
import { partition } from 'lodash'

import { LivenessConfigurationRecord } from '../repositories/LivenessConfigurationRepository'

export function getLivenessSyncedUntil(
  configurations: LivenessConfigurationRecord[],
): UnixTime | undefined {
  if (configurations.length === 0) {
    return undefined
  }

  const [configsWithoutUntil, configsWithUntil] = partition(
    configurations,
    (c) => c.untilTimestamp === undefined,
  )

  const configsToUse =
    configsWithoutUntil.length !== 0 &&
    configsWithoutUntil.some((c) => c.lastSyncedTimestamp !== undefined)
      ? configsWithoutUntil
      : configsWithUntil

  const lastSyncedTimestamps = configsToUse
    .map((c) => c.lastSyncedTimestamp?.toNumber())
    .filter(notUndefined)

  if (lastSyncedTimestamps.length === 0) {
    return undefined
  }

  const syncedUntil = Math.min(...lastSyncedTimestamps)
  return new UnixTime(syncedUntil)
}
