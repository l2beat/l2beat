import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { getDb } from '~/server/database'
import { ChartRange } from '~/utils/range/range'
import {
  getSummedTvsValues,
  type SummedTvsValues,
} from '../scaling/tvs/utils/getSummedTvsValues'
import { getPrivacyProjects } from './getPrivacyProjects'
import {
  buildPrivacyChart,
  type PrivacyChartPoint,
  type PrivacyChartResponse,
  type PrivacyTvsChartPoint,
} from './privacyChartUtils'

export const PrivacyProjectChartParams = v.object({
  projectId: v.string(),
  range: ChartRange,
})

export type PrivacyProjectChartParams = v.infer<
  typeof PrivacyProjectChartParams
>

export type PrivacyProjectChartPoint = PrivacyChartPoint
export interface PrivacyProjectChartResponse extends PrivacyChartResponse {
  tvsChart: PrivacyTvsChartPoint[]
  tvsSyncedUntil: number | undefined
}

export async function getPrivacyProjectChart(
  params: PrivacyProjectChartParams,
): Promise<PrivacyProjectChartResponse> {
  const db = getDb()
  const projects = await getPrivacyProjects()
  const project = projects.find((project) => project.id === params.projectId)

  if (!project) {
    return {
      chart: [],
      syncedUntil: undefined,
      tvsChart: [],
      tvsSyncedUntil: undefined,
    }
  }

  const projectIds = [project.id]

  const [dailyRows, _bucketTotals, syncedUntil, tvsValues] = await Promise.all([
    db.privacyFlowEvent.getDailyByProjectIds(
      [project.id.toString()],
      UnixTime(0),
      UnixTime.now(),
    ),
    db.privacyFlowEvent.getBucketTotalsByProjectIds([project.id.toString()]),
    db.privacyFlowEvent.getLatestTimestampByProjectIds([project.id.toString()]),
    getSummedTvsValues(projectIds, params.range, {
      forSummary: false,
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: false,
    }),
  ])

  const priceIds = [
    ...new Set(project.privacyInfo.tokens.map((token) => token.token.priceId)),
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
    [project],
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
