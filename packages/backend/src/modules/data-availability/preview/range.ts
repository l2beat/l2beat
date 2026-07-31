import { UnixTime } from '@l2beat/shared-pure'

export interface PreviewWindow {
  from: UnixTime
  to: UnixTime
}

export function parseTimeArg(value: string): UnixTime {
  if (/^\d+$/.test(value)) {
    return Number(value)
  }
  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) {
    throw new Error(
      `Cannot parse time argument '${value}' - use unix seconds or an ISO date`,
    )
  }
  return UnixTime.fromDate(new Date(parsed))
}

export function resolveWindow(
  from: UnixTime | undefined,
  to: UnixTime | undefined,
  now: UnixTime = UnixTime.now(),
): PreviewWindow {
  const resolvedTo = UnixTime.toStartOf(to ?? now, 'hour')
  const resolvedFrom = UnixTime.toStartOf(
    from ?? resolvedTo - 3 * UnixTime.HOUR,
    'hour',
  )
  if (resolvedFrom >= resolvedTo) {
    throw new Error(
      `Invalid window: from (${resolvedFrom}) must be before to (${resolvedTo})`,
    )
  }
  return { from: resolvedFrom, to: resolvedTo }
}

export function clampBlockRange(
  config: { sinceBlock: number; untilBlock?: number },
  fromBlock: number,
  toBlock: number,
): { from: number; to: number } | undefined {
  const from = Math.max(fromBlock, config.sinceBlock)
  const to =
    config.untilBlock !== undefined
      ? Math.min(toBlock, config.untilBlock)
      : toBlock
  if (from > to) {
    return undefined
  }
  return { from, to }
}

export function clampTimestampRange(
  config: { sinceTimestamp: UnixTime; untilTimestamp?: UnixTime },
  from: UnixTime,
  to: UnixTime,
): { from: UnixTime; to: UnixTime } | undefined {
  const clampedFrom = Math.max(from, config.sinceTimestamp)
  const clampedTo =
    config.untilTimestamp !== undefined
      ? Math.min(to, config.untilTimestamp)
      : to
  if (clampedFrom >= clampedTo) {
    return undefined
  }
  return { from: clampedFrom, to: clampedTo }
}

/** Hour starts in [window.from, window.to), assuming an hour-aligned window. */
export function hoursInWindow(window: PreviewWindow): UnixTime[] {
  const hours: UnixTime[] = []
  for (let hour = window.from; hour < window.to; hour += UnixTime.HOUR) {
    hours.push(hour)
  }
  return hours
}
