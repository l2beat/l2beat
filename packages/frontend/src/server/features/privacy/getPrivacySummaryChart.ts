import { UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import {
  getSummedTvsValues,
  type SummedTvsValues,
} from '../scaling/tvs/utils/getSummedTvsValues'
import { getPrivacyProjects } from './getPrivacyProjects'
import {
  buildPrivacyChart,
  type PrivacyChartResponse,
  type PrivacyTvsChartPoint,
} from './privacyChartUtils'

export interface PrivacySummaryChartResponse extends PrivacyChartResponse {
  tvsChart: PrivacyTvsChartPoint[]
  tvsSyncedUntil: number | undefined
}

export async function getPrivacySummaryChart(params: {
  range: [UnixTime | null, UnixTime]
}): Promise<PrivacySummaryChartResponse> {
  const db = getDb()
  const projects = await getPrivacyProjects()
  const projectIds = projects.map((p) => p.id)

  const [dailyRows, _bucketTotals, syncedUntil, tvsValues] = await Promise.all([
    db.privacyFlowEvent.getDailyByProjectIds(
      projects.map((p) => p.id.toString()),
      UnixTime(0),
      UnixTime.now(),
    ),
    db.privacyFlowEvent.getBucketTotalsByProjectIds(
      projects.map((p) => p.id.toString()),
    ),
    db.privacyFlowEvent.getLatestTimestampByProjectIds(
      projects.map((p) => p.id.toString()),
    ),
    getSummedTvsValues(projectIds, params.range, {
      forSummary: true,
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: false,
    }),
  ])

  const priceIds = [
    ...new Set(
      projects.flatMap((project) =>
        project.privacyInfo.tokens.map((token) => token.token.priceId),
      ),
    ),
  ]
  const priceRecords = await Promise.all(
    priceIds.map((priceId) => db.privacyPrice.getLatestPriceByPriceId(priceId)),
  )
  const priceById = new Map(
    priceRecords
      .filter((p) => p !== undefined)
      .map((p) => [p.priceId, p.priceUsd]),
  )

  const flowChart = buildPrivacyChart(
    projects,
    dailyRows,
    syncedUntil,
    priceById,
    params.range,
  )

  const tvsChart = buildPrivacyTvsChart(tvsValues)

  return {
    ...flowChart,
    tvsChart,
    tvsSyncedUntil: tvsValues.at(-1)?.timestamp,
  }
}

function buildPrivacyTvsChart(
  values: SummedTvsValues[],
): PrivacyTvsChartPoint[] {
  return values.map((v) => [v.timestamp, v.value ?? 0])
}
