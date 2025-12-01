import { assert, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { ChartRange } from '~/utils/range/range'
import { getEthPrices } from './utils/getEthPrices'
import {
  getSummedTvsValues,
  type SummedTvsValues,
} from './utils/getSummedTvsValues'
import { rangeToResolution } from './utils/range'

export const TvsChartWithProjectsRangesDataParams = v.object({
  range: ChartRange,
  excludeAssociatedTokens: v.boolean(),
  includeRwaRestrictedTokens: v.boolean(),
  projects: v.array(
    v.object({
      projectId: v.string().transform((value) => value as ProjectId),
      sinceTimestamp: v.number(),
      untilTimestamp: v.number().optional(),
    }),
  ),
})

export type TvsChartWithProjectsRangesDataParams = v.infer<
  typeof TvsChartWithProjectsRangesDataParams
>

type DetailedTvsChartWithProjectRangesDataPoint = [
  timestamp: number,
  ethPrice: number | null,
  native: number | null,
  canonical: number | null,
  external: number | null,
  ether: number | null,
  stablecoins: number | null,
  bitcoin: number | null,
  other: number | null,
  rwaRestricted: number | null,
  rwaPublic: number | null,
]

export type DetailedTvsChartWithProjectsRangesData = {
  chart: DetailedTvsChartWithProjectRangesDataPoint[]
  syncedUntil: number
}

/**
 * @returns [timestamp, ethPrice, native, canonical, external, ether, stablecoins, bitcoin, other][]
 */
export async function getDetailedTvsChartWithProjectsRanges({
  range,
  excludeAssociatedTokens,
  includeRwaRestrictedTokens,
  projects,
}: TvsChartWithProjectsRangesDataParams): Promise<DetailedTvsChartWithProjectsRangesData> {
  if (env.MOCK) {
    return getMockDetailedTvsChartWithProjectsRangesData({
      range,
      excludeAssociatedTokens,
      includeRwaRestrictedTokens,
      projects,
    })
  }

  if (projects.length === 0) {
    return { chart: [], syncedUntil: UnixTime.now() }
  }
  const [ethPrices, values] = await Promise.all([
    getEthPrices(),
    getSummedTvsValues(projects, range, {
      forSummary: false,
      excludeAssociatedTokens,
      includeRwaRestrictedTokens,
    }),
  ])

  return getChartData(values, ethPrices)
}

function getChartData(
  values: SummedTvsValues[],
  ethPrices: Record<number, number>,
): DetailedTvsChartWithProjectsRangesData {
  let syncedUntil = 0
  const chart: DetailedTvsChartWithProjectRangesDataPoint[] = []

  for (const value of values) {
    if (
      value.native === null &&
      value.canonical === null &&
      value.external === null &&
      value.ether === null &&
      value.stablecoin === null &&
      value.btc === null &&
      value.other === null
    ) {
      chart.push([
        value.timestamp,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ] as const)
      continue
    }

    const ethPrice = ethPrices[value.timestamp]
    assert(ethPrice, 'No ETH price for ' + value.timestamp)

    chart.push([
      value.timestamp,
      ethPrice,
      value.native,
      value.canonical,
      value.external,
      value.ether,
      value.stablecoin,
      value.btc,
      value.other,
      value.rwaRestricted,
      value.rwaPublic,
    ] as const)

    syncedUntil = value.timestamp
  }

  return {
    chart,
    syncedUntil,
  }
}

function getMockDetailedTvsChartWithProjectsRangesData({
  range,
}: TvsChartWithProjectsRangesDataParams): DetailedTvsChartWithProjectsRangesData {
  const resolution = rangeToResolution(range)
  const timestamps = generateTimestamps(
    [range[0] ?? 1573776000, range[1]],
    resolution,
  )

  return {
    chart: timestamps.map((timestamp) => {
      return [
        timestamp,
        3000,
        2000,
        1000,
        1200,
        1000,
        1000,
        1000,
        1000,
        1000,
        1000,
      ]
    }),
    syncedUntil: timestamps[timestamps.length - 1] ?? 0,
  }
}
