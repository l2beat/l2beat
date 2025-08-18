import { assert, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import groupBy from 'lodash/groupBy'
import partition from 'lodash/partition'
import { getDb } from '~/server/database'
import { getTimestampedValuesRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { getTvsProjects } from './utils/getTvsProjects'
import {
  createTvsProjectsFilter,
  TvsProjectFilter,
} from './utils/projectFilterUtils'
import { rangeToResolution, TvsChartRange } from './utils/range'

export const EtherAndStablecoinsChartsDataParams = v.object({
  range: TvsChartRange,
  filter: TvsProjectFilter,
})

export type EtherAndStablecoinsChartsDataParams = v.infer<
  typeof EtherAndStablecoinsChartsDataParams
>

/**
 * @returns [timestamp: number, ether: Record<string, number>, stablecoin: Record<string, number>]
 */
export async function getEtherAndStablecoinsCharts({
  range,
  filter,
}: EtherAndStablecoinsChartsDataParams) {
  const db = getDb()
  const resolution = rangeToResolution({ type: range })

  const [from, to] = getTimestampedValuesRange({ type: range }, resolution, {
    offset: -UnixTime.HOUR - 15 * UnixTime.MINUTE,
  })
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

  const tvsConfigs = tvsProjects.flatMap((p) => p.tvsConfig)

  const tokenIdToPriceId = new Map(
    tvsConfigs.map((c) => [c.id as string, c.name]),
  )
  const priceIdToCategory = new Map(tvsConfigs.map((c) => [c.name, c.category]))

  const data = await db.tvsTokenValue.getByTokenIdsInTimeRange(
    tvsConfigs
      .filter((c) => c.category === 'stablecoin' || c.category === 'ether')
      .map((c) => c.id),
    from,
    to,
  )

  const withPriceId = data.map((d) => {
    const priceId = tokenIdToPriceId.get(d.tokenId)
    assert(priceId, 'Metadata not found')
    return {
      ...d,
      priceId,
    }
  })

  const groupedByPriceId = groupBy(withPriceId, (e) => e.priceId)

  const [stablecoinsEntries, etherEntries] = partition(
    Object.entries(groupedByPriceId),
    ([priceId]) => priceIdToCategory.get(priceId) === 'stablecoin',
  )

  const latestStablecoins: Record<string, number> = {}
  for (const [priceId, values] of stablecoinsEntries) {
    latestStablecoins[priceId] = values.at(-1)?.valueForSummary ?? 0
  }

  const latestEther: Record<string, number> = {}
  for (const [priceId, values] of etherEntries) {
    latestEther[priceId] = values.at(-1)?.valueForSummary ?? 0
  }

  const top10Stablecoins = Object.entries(latestStablecoins)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map((e) => e[0])
  const top10Ether = Object.entries(latestEther)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map((e) => e[0])

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const minTimestamp = data.at(0)?.timestamp!

  const timestamps = generateTimestamps([minTimestamp, to], resolution)

  const chart: Record<
    number,
    Record<'stablecoins' | 'ether', Record<string, number>>
  > = {}
  for (const id of top10Stablecoins) {
    const values = stablecoinsEntries.find((e) => e[0] === id)?.[1]
    const groupedByTimestamp = groupBy(values, (e) => e.timestamp)

    for (const timestamp of timestamps) {
      const value =
        groupedByTimestamp[timestamp]?.reduce(
          (acc, e) => acc + e.valueForSummary,
          0,
        ) ?? 0

      if (!chart[timestamp]) {
        chart[timestamp] = {
          stablecoins: {},
          ether: {},
        }
      }

      chart[timestamp].stablecoins[id] = value
    }
  }

  for (const id of top10Ether) {
    const values = etherEntries.find((e) => e[0] === id)?.[1]
    const groupedByTimestamp = groupBy(values, (e) => e.timestamp)
    for (const timestamp of timestamps) {
      const value =
        groupedByTimestamp[timestamp]?.reduce(
          (acc, e) => acc + e.valueForSummary,
          0,
        ) ?? 0
      if (!chart[timestamp]) {
        chart[timestamp] = {
          stablecoins: {},
          ether: {},
        }
      }
      chart[timestamp].ether[id] = value
    }
  }

  return {
    chart: Object.entries(chart).map(([timestamp, values]) => {
      return [+timestamp, values.stablecoins, values.ether] as const
    }),
    syncedUntil: UnixTime.now(),
  }
}
