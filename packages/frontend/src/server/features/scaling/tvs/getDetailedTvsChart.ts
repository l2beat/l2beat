import { assert, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { ChartRange } from '~/utils/range/range'
import { getEthPrices } from './utils/getEthPrices'
import {
  getSummedTvsValues,
  type SummedTvsValues,
} from './utils/getSummedTvsValues'
import { getTvsProjects } from './utils/getTvsProjects'
import {
  createTvsProjectsFilter,
  TvsProjectFilter,
} from './utils/projectFilterUtils'
import { rangeToResolution } from './utils/range'

export const DetailedTvsChartDataParams = v.object({
  range: ChartRange,
  excludeAssociatedTokens: v.boolean(),
  excludeRwaRestrictedTokens: v.boolean(),
  filter: TvsProjectFilter,
})

export type DetailedTvsChartDataParams = v.infer<
  typeof DetailedTvsChartDataParams
>

type DetailedTvsChartDataPoint = [
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

export type DetailedTvsChartData = {
  chart: DetailedTvsChartDataPoint[]
  syncedUntil: number
}

/**
 * @returns [timestamp, ethPrice, native, canonical, external, ether, stablecoins, bitcoin, other][]
 */
export async function getDetailedTvsChart({
  range,
  excludeAssociatedTokens,
  excludeRwaRestrictedTokens,
  filter,
}: DetailedTvsChartDataParams): Promise<DetailedTvsChartData> {
  if (env.MOCK) {
    return getMockDetailedTvsChartData({
      range,
      excludeAssociatedTokens,
      excludeRwaRestrictedTokens,
      filter,
    })
  }

  // NOTE: Quick fix for now, we should reinvestigate if this is the best way to handle this
  const forSummary =
    filter.type !== 'projects' || filter.projectIds.length !== 1

  const projectsFilter = createTvsProjectsFilter(filter)
  const tvsProjects = await getTvsProjects(projectsFilter, {
    withoutArchivedAndUpcoming: forSummary,
  })
  if (tvsProjects.length === 0) {
    return { chart: [], syncedUntil: UnixTime.now() }
  }
  const [ethPrices, values] = await Promise.all([
    getEthPrices(),
    getSummedTvsValues(
      tvsProjects.map((p) => p.projectId),
      range,
      {
        forSummary,
        excludeAssociatedTokens,
        excludeRwaRestrictedTokens,
      },
    ),
  ])

  return getChartData(values, ethPrices)
}

function getChartData(
  values: SummedTvsValues[],
  ethPrices: Record<number, number>,
): DetailedTvsChartData {
  let syncedUntil = 0
  const chart: DetailedTvsChartDataPoint[] = []

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

function getMockDetailedTvsChartData({
  range,
}: DetailedTvsChartDataParams): DetailedTvsChartData {
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
