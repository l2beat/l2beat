import { UnixTime } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'

export function isCostsSynced({
  to,
  syncedUntil,
}: {
  to: UnixTime
  syncedUntil: UnixTime
}): boolean {
  return to - 6 * UnixTime.HOUR <= syncedUntil
}

export function getCostsSyncWarning(
  syncedUntil: UnixTime | undefined,
): string | undefined {
  if (syncedUntil === undefined) {
    return undefined
  }
  if (isCostsSynced({ syncedUntil, to: UnixTime.now() })) {
    return undefined
  }
  return `No costs data since ${formatTimestamp(syncedUntil, {
    mode: 'datetime',
    longMonthName: true,
  })}.`
}
