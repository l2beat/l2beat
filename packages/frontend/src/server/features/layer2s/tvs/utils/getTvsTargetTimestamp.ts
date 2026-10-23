import { UnixTime } from '@l2beat/shared-pure'

/**
 * Fallback for getSyncedTvsTimestamp when sync metadata has nothing fresh.
 * The backend targets the previous full hour; the extra 15 minutes give it
 * time to sync that hour, since nothing here says whether it has.
 */
export function getTvsTargetTimestamp() {
  return UnixTime.toStartOf(
    UnixTime.now() - UnixTime.HOUR - 15 * UnixTime.MINUTE,
    'hour',
  )
}
