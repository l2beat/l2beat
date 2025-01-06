import { UnixTime } from '@l2beat/shared-pure'

export function getCurrentEntry<
  T extends { sinceTimestamp?: UnixTime; untilTimestamp?: UnixTime },
>(entries: T[] | null | undefined) {
  const now = UnixTime.now()
  return entries?.find(
    (entry) =>
      (!entry.sinceTimestamp || entry.sinceTimestamp.lte(now)) &&
      (!entry.untilTimestamp || entry.untilTimestamp.gt(now)),
  )
}
