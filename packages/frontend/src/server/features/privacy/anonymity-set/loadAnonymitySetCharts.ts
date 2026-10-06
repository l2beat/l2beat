import type { PrivacyAnonymitySetSenderDayRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import range from 'lodash/range'
import {
  ANONYMITY_SET_WINDOW_DAYS,
  calculateAnonymitySetHistory,
  calculateAnonymitySetHoldingDuration,
  type PrivacyAnonymitySetHistoryPoint,
  type PrivacyAnonymitySetHoldingDurationPoint,
} from './calculateAnonymitySets'
import type { PrivacyAnonymitySetSeries } from './getPrivacyAnonymitySetSeries'

export const MIN_HOLDING_DAYS = 7
export const MAX_HOLDING_DAYS = 365
export const HOLDING_DURATIONS = range(MIN_HOLDING_DAYS, MAX_HOLDING_DAYS + 1)

export type FetchSenderDays = (
  fromInclusive: UnixTime,
  toExclusive: UnixTime,
) => Promise<PrivacyAnonymitySetSenderDayRecord[]>

export interface AnonymitySetCharts {
  history: PrivacyAnonymitySetHistoryPoint[]
  holdingDuration: PrivacyAnonymitySetHoldingDurationPoint[]
}

/**
 * Loads sender days in pages of MAX_HOLDING_DAYS aligned to the last endpoint,
 * so a project's full history is never held in memory at once. Every history
 * point depends only on the ANONYMITY_SET_WINDOW_DAYS before it, so each page
 * is fetched with that much overlap, and the last page is exactly the input
 * the holding-duration chart needs.
 *
 * `endpoints` must be ascending daily timestamps.
 */
export async function loadAnonymitySetCharts(
  series: PrivacyAnonymitySetSeries[],
  endpoints: UnixTime[],
  fetchSenderDays: FetchSenderDays,
): Promise<AnonymitySetCharts> {
  const firstEndpoint = endpoints[0]
  const lastEndpoint = endpoints.at(-1)
  if (firstEndpoint === undefined || lastEndpoint === undefined) {
    return { history: [], holdingDuration: [] }
  }

  const history: PrivacyAnonymitySetHistoryPoint[] = []
  let holdingDuration: PrivacyAnonymitySetHoldingDurationPoint[] = []

  for (const page of getPages(firstEndpoint, lastEndpoint)) {
    const rows = await fetchSenderDays(
      UnixTime(page.start - ANONYMITY_SET_WINDOW_DAYS * UnixTime.DAY),
      page.end,
    )
    const pageEndpoints = endpoints.filter(
      (endpoint) =>
        (endpoint > page.start ||
          (page.start === firstEndpoint && endpoint === firstEndpoint)) &&
        endpoint <= page.end,
    )
    history.push(...calculateAnonymitySetHistory(rows, series, pageEndpoints))

    if (page.end === lastEndpoint) {
      holdingDuration = calculateAnonymitySetHoldingDuration(
        rows,
        series,
        lastEndpoint,
        HOLDING_DURATIONS,
      )
    }
  }

  return { history, holdingDuration }
}

/** Ascending pages covering (start, end], the last one ending at `last`. */
function getPages(
  first: UnixTime,
  last: UnixTime,
): { start: UnixTime; end: UnixTime }[] {
  const pageLength = MAX_HOLDING_DAYS * UnixTime.DAY
  const pages: { start: UnixTime; end: UnixTime }[] = []
  let end = last
  while (true) {
    const start = UnixTime(Math.max(first, end - pageLength))
    pages.unshift({ start, end })
    if (start === first) return pages
    end = start
  }
}
