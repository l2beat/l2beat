import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { ps } from '~/server/projects'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { ChartRange } from '~/utils/range/range'
import {
  calculateAnonymitySetHistory,
  calculateAnonymitySetHoldingDuration,
  type PrivacyAnonymitySetHistoryPoint,
  type PrivacyAnonymitySetHoldingDurationPoint,
} from './anonymity-set/calculateAnonymitySets'
import {
  getPrivacyAnonymitySetSeries,
  type PrivacyAnonymitySetProject,
  type PrivacyAnonymitySetSeries,
} from './anonymity-set/getPrivacyAnonymitySetSeries'
import {
  getPrivacyAnonymitySetConfigurations,
  getPrivacyAnonymitySetSyncedUntil,
} from './anonymity-set/getPrivacyAnonymitySetSync'

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
  syncedUntil: number | undefined
}

const HOLDING_DURATIONS = Array.from({ length: 359 }, (_, index) => index + 7)
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
          key: ['privacy-anonymity-set-chart', project.id],
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
  const configurations = await getPrivacyAnonymitySetConfigurations(db, [
    project,
  ])
  const syncedUntil = getPrivacyAnonymitySetSyncedUntil(project, configurations)
  if (syncedUntil === undefined) {
    return {
      ...emptyResponse(),
      series: toResponseSeries(series),
    }
  }

  const firstSeriesDay = UnixTime.toStartOf(
    Math.min(...series.map((item) => item.sinceTimestamp)),
    'day',
  )
  const holdingEndpoint = UnixTime.toStartOf(
    Math.min(currentDay, syncedUntil),
    'day',
  )
  if (holdingEndpoint < firstSeriesDay) {
    return {
      ...emptyResponse(),
      series: toResponseSeries(series),
      syncedUntil: holdingEndpoint,
    }
  }

  const historyEndpoints = generateTimestamps(
    [UnixTime(firstSeriesDay), UnixTime(holdingEndpoint)],
    'day',
  )
  const rows = await db.privacyAnonymitySetEvent.getSenderDaysByProjectIds(
    [project.id],
    UnixTime(firstSeriesDay),
    holdingEndpoint,
  )

  return {
    series: toResponseSeries(series),
    history: calculateAnonymitySetHistory(rows, series, historyEndpoints),
    holdingDuration: calculateAnonymitySetHoldingDuration(
      rows,
      series,
      holdingEndpoint,
      HOLDING_DURATIONS,
    ),
    syncedUntil: holdingEndpoint,
  }
}

export function selectPrivacyAnonymitySetChartRange(
  snapshot: PrivacyAnonymitySetChartResponse,
  range: ChartRange,
): PrivacyAnonymitySetChartResponse {
  const from = range[0]
  const fromDay = from === null ? null : UnixTime.toStartOf(from, 'day')
  const toDay = UnixTime.toStartOf(range[1], 'day')

  return {
    ...snapshot,
    history: snapshot.history.filter(
      ([timestamp]) =>
        (fromDay === null || timestamp >= fromDay) && timestamp <= toDay,
    ),
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
    syncedUntil: endpoint,
  }
}
