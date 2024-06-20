import {
  TrackedTxsConfigSubtype,
  UnixTime,
  notUndefined,
} from '@l2beat/shared-pure'
import { TrackedTxsConfig } from '../../types/TrackedTxsConfig'

export type LivenessTrackedTxsConfig = {
  entries: LivenessTrackedTxsConfigEntry[]
}

export type LivenessTrackedTxsConfigEntry = {
  subtype: TrackedTxsConfigSubtype
  untilTimestamp: UnixTime | undefined
}

export function getLivenessTrackedTxsConfig(
  trackedTxsConfig: TrackedTxsConfig,
): LivenessTrackedTxsConfig {
  return {
    entries: trackedTxsConfig.entries
      .flatMap((entry) => {
        return entry.uses.flatMap((use) => {
          if (use.type !== 'liveness') {
            return
          }

          return {
            subtype: use.subtype,
            untilTimestamp: entry.untilTimestampExclusive,
          }
        })
      })
      .filter(notUndefined),
  }
}
