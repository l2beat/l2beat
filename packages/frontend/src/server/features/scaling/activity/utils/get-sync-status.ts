import { UnixTime } from '@l2beat/shared-pure'

export function getSyncStatus(syncedUntil: UnixTime) {
  const isSynced = UnixTime.now().add(-2, 'days').lte(syncedUntil)
  return { isSynced, syncedUntil: syncedUntil.toNumber() }
}
