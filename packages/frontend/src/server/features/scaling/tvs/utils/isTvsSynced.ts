import { UnixTime } from '@l2beat/shared-pure'

export function isTvsSynced(syncedUntil: UnixTime): boolean {
  return UnixTime.now() - 6 * UnixTime.HOUR <= syncedUntil
}
