import { UnixTime } from '@l2beat/shared-pure'

/**
 * A wall-clock guess of the latest synced hour: getSyncedTvsTimestamp's
 * fallback when sync metadata has nothing fresh, and enough wherever an hour
 * either way does not matter. The backend targets the previous full hour;
 * the extra 15 minutes give it time to sync that hour, since nothing here
 * says whether it has.
 */
export function getTvsTargetTimestamp() {
  return UnixTime.toStartOf(
    UnixTime.now() - UnixTime.HOUR - 15 * UnixTime.MINUTE,
    'hour',
  )
}
