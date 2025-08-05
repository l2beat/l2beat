import { UnixTime } from '@l2beat/shared-pure'

export function isCostsSynced(syncedUntil: UnixTime): boolean {
  return UnixTime.now() - 6 * UnixTime.HOUR <= syncedUntil
}
