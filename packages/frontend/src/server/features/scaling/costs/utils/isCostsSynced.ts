import { UnixTime } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'

export function isCostsSynced(syncedUntil: UnixTime): boolean {
  return UnixTime.now() - 6 * UnixTime.HOUR <= syncedUntil
}

export function getCostsSyncWarning(syncedUntil: UnixTime): string | undefined {
  if (isCostsSynced(syncedUntil)) {
    return undefined
  }

  return `No costs data since ${formatTimestamp(syncedUntil, {
    mode: 'datetime',
    longMonthName: true,
  })}.`
}
