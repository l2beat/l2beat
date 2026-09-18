import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { ps } from '~/server/projects'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { ChartRange } from '~/utils/range/range'
import type {
  PrivacyAnonymitySetHistoryPoint,
  PrivacyAnonymitySetHoldingDurationPoint,
} from './anonymity-set/calculateAnonymitySets'
import {
  getPrivacyAnonymitySetSeries,
  type PrivacyAnonymitySetProject,
  type PrivacyAnonymitySetSeries,
} from './anonymity-set/getPrivacyAnonymitySetSeries'
import {
  getPrivacyAnonymitySetConfigurations,
  getPrivacyAnonymitySetSyncStatus,
} from './anonymity-set/getPrivacyAnonymitySetSync'
import {
  HOLDING_DURATIONS,
  loadAnonymitySetCharts,
} from './anonymity-set/loadAnonymitySetCharts'

export const PrivacyAnonymitySetChartParams = v.object({
  projectId: v.string(),
  range: ChartRange,
})

export type PrivacyAnonymitySetChartParams = v.infer<
  typeof PrivacyAnonymitySetChartParams
>

export interface PrivacyAnonymitySetChartResponse {
  series: Pick<
    PrivacyAnonymitySetSeries,
    'id' | 'label' | 'token' | 'minimumAmount'
  >[]
  history: PrivacyAnonymitySetHistoryPoint[]
  holdingDuration: PrivacyAnonymitySetHoldingDurationPoint[]
  /** Labels of configured series excluded from the charts while their history is indexed. */
  syncingLabels: string[]
  syncedUntil: number | undefined
}

const cache = new FrontendInMemoryCache('getPrivacyAnonymitySetChart')

export async function getPrivacyAnonymitySetChart(
  params: PrivacyAnonymitySetChartParams,
): Promise<PrivacyAnonymitySetChartResponse> {
  const project = await ps.getProject({
    id: ProjectId(params.projectId),
    select: ['privacyInfo'],
  })
  if (!project) return emptyResponse()

  const series = getPrivacyAnonymitySetSeries(project)
  if (series.length === 0) return emptyResponse()

  const currentDay = UnixTime.toStartOf(UnixTime.now(), 'day')
  const snapshot = env.MOCK
    ? getMockResponse(series, currentDay)
    : await cache.get(
        {
          key: [
            'privacy-anonymity-set-chart',
            project.id,
            currentDay.toString(),
          ],
          ttl: 10 * UnixTime.MINUTE,
          staleWhileRevalidate: 15 * UnixTime.MINUTE,
        },
        () => getPrivacyAnonymitySetSnapshot(project, series, currentDay),
      )

  return selectPrivacyAnonymitySetChartRange(snapshot, params.range)
}

async function getPrivacyAnonymitySetSnapshot(
  project: PrivacyAnonymitySetProject,
  series: PrivacyAnonymitySetSeries[],
  currentDay: UnixTime,
): Promise<PrivacyAnonymitySetChartResponse> {
  const db = getDb()
  const configurations = await getPrivacyAnonymitySetConfigurations(db, series)
  const { syncedSeries, syncingLabels } = getPrivacyAnonymitySetSyncStatus(
    series,
    configurations,
    currentDay,
  )
  if (syncedSeries.length === 0) {
    return {
      ...emptyResponse(),
      syncingLabels,
    }
  }

  const firstSeriesDay = UnixTime.toStartOf(
    Math.min(...syncedSeries.map((item) => item.sinceTimestamp)),
    'day',
  )
  const holdingEndpoint = currentDay
  if (holdingEndpoint < firstSeriesDay) {
    return {
      ...emptyResponse(),
      series: toResponseSeries(syncedSeries),
      syncingLabels,
      syncedUntil: holdingEndpoint,
    }
  }

  const historyEndpoints = generateTimestamps(
    [UnixTime(firstSeriesDay), UnixTime(holdingEndpoint)],
    'day',
  )
  const { history, holdingDuration } = await loadAnonymitySetCharts(
    syncedSeries,
    historyEndpoints,
    (from, to) =>
      db.privacyAnonymitySetEvent.getSenderDaysByProjectIds(
        [project.id],
        from,
        to,
      ),
  )

  return {
    series: toResponseSeries(syncedSeries),
    history: trimLeadingEmptyAnonymitySetHistory(history),
    holdingDuration,
    syncingLabels,
    syncedUntil: holdingEndpoint,
  }
}

export function trimLeadingEmptyAnonymitySetHistory(
  history: PrivacyAnonymitySetHistoryPoint[],
): PrivacyAnonymitySetHistoryPoint[] {
  const firstNonZeroIndex = history.findIndex(([, ...values]) =>
    values.some((value) => value !== 0),
  )

  return firstNonZeroIndex === -1 ? [] : history.slice(firstNonZeroIndex)
}

export function selectPrivacyAnonymitySetChartRange(
  snapshot: PrivacyAnonymitySetChartResponse,
  requested: ChartRange,
): PrivacyAnonymitySetChartResponse {
  // The snapshot already ends at the latest complete UTC day, so only the
  // start of the range is applied. The requested end is derived from the
  // current hour and would drop that day's point shortly after midnight.
  const from = requested[0]
  if (from === null) return snapshot

  const fromDay = UnixTime.toStartOf(from, 'day')
  return {
    ...snapshot,
    history: snapshot.history.filter(([timestamp]) => timestamp >= fromDay),
  }
}

function toResponseSeries(series: PrivacyAnonymitySetSeries[]) {
  return series.map(({ id, label, token, minimumAmount }) => ({
    id,
    label,
    token,
    minimumAmount,
  }))
}

function emptyResponse(): PrivacyAnonymitySetChartResponse {
  return {
    series: [],
    history: [],
    holdingDuration: [],
    syncingLabels: [],
    syncedUntil: undefined,
  }
}

function getMockResponse(
  series: PrivacyAnonymitySetSeries[],
  endpoint: UnixTime,
): PrivacyAnonymitySetChartResponse {
  const start = endpoint - 365 * UnixTime.DAY
  const endpoints = generateTimestamps([UnixTime(start), endpoint], 'day')

  return {
    series: toResponseSeries(series),
    history: endpoints.map((timestamp, index) => [
      timestamp,
      ...series.map((_, seriesIndex) =>
        Math.round((seriesIndex + 1) * 20 + index * 0.5),
      ),
    ]),
    holdingDuration: HOLDING_DURATIONS.map((days) => {
      return [
        days,
        ...series.map((_, seriesIndex) =>
          Math.round((seriesIndex + 1) * days * 0.8),
        ),
      ]
    }),
    syncingLabels: [],
    syncedUntil: endpoint,
  }
}
