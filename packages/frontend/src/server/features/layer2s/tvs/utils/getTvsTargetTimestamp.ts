import { UnixTime } from '@l2beat/shared-pure'

/**
 * The hour every project should have synced by now: the backend targets the
 * previous full hour and gets 15 minutes to sync it. Older values are late
 * and get a sync warning. Reads use getLatestTvsTimestamp instead.
 */
export function getTvsTargetTimestamp() {
  return UnixTime.toStartOf(
    UnixTime.now() - UnixTime.HOUR - 15 * UnixTime.MINUTE,
    'hour',
  )
}
