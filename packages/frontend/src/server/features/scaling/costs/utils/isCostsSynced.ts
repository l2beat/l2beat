import { UnixTime } from '@l2beat/shared-pure'

export function isCostsSynced({
  to,
  syncedUntil,
}: {
  to: UnixTime
  syncedUntil: UnixTime
}): boolean {
  return to - 6 * UnixTime.HOUR <= syncedUntil
}
