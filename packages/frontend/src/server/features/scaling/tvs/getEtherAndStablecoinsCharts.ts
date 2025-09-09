import type { TokenValueRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import groupBy from 'lodash/groupBy'
import partition from 'lodash/partition'
import { getDb } from '~/server/database'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
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

  const tokenIdToSymbol = new Map(
    tvsConfigs.map((c) => [c.id as string, c.symbol]),
  )
  const symbolToCategory = new Map(
    tvsConfigs.map((c) => [c.symbol, c.category]),
  )

  const data = await db.tvsTokenValue.getByTokenIdsInTimeRange(
    tvsConfigs
      .filter((c) => c.category === 'stablecoin' || c.category === 'ether')
      .map((c) => c.id),
    from,
    to,
  )

  const withSymbol = data.map((d) => {
    const symbol = tokenIdToSymbol.get(d.tokenId)
    assert(symbol, 'Metadata not found')
    return {
      ...d,
      symbol,
    }
  })

  const summedBySymbol = sumBySymbol(withSymbol)

  const [stablecoinsEntries, etherEntries] = partition(
    Object.entries(summedBySymbol),
    ([symbol]) => symbolToCategory.get(symbol) === 'stablecoin',
  )

  const latestStablecoins: Record<string, number> = {}
  for (const [symbol, values] of stablecoinsEntries) {
    const latestRecord = values.at(-1)
    if (latestRecord?.timestamp === to) {
      latestStablecoins[symbol] = latestRecord.value
    }
  }

  const latestEther: Record<string, number> = {}
  for (const [symbol, values] of etherEntries) {
    const latestRecord = values.at(-1)
    if (latestRecord?.timestamp === to) {
      latestEther[symbol] = latestRecord.value
    }
  }

  const stablecoins = Object.entries(latestStablecoins)
    .sort((a, b) => b[1] - a[1])
    .map((e) => e[0])

  const ethers = Object.entries(latestEther)
    .sort((a, b) => b[1] - a[1])
    .map((e) => e[0])

  const minTimestamp = data.at(0)?.timestamp
  assert(minTimestamp, 'No data')

  const timestamps = generateTimestamps([minTimestamp, to], 'daily')

  const chartData: Record<
    number,
    Record<'stablecoins' | 'ether', Record<string, number>>
  > = {}
  for (const id of stablecoins) {
    const values = stablecoinsEntries.find((e) => e[0] === id)?.[1]
    const groupedByTimestamp = groupBy(values, (e) => e.timestamp)

    for (const timestamp of timestamps) {
      const value =
        groupedByTimestamp[timestamp]?.reduce((acc, e) => acc + e.value, 0) ?? 0

      if (!chartData[timestamp]) {
        chartData[timestamp] = {
          stablecoins: {},
          ether: {},
        }
      }

      chartData[timestamp].stablecoins[id] = value
    }
  }

  for (const id of ethers) {
    const values = etherEntries.find((e) => e[0] === id)?.[1]
    const groupedByTimestamp = groupBy(values, (e) => e.timestamp)
    for (const timestamp of timestamps) {
      const value =
        groupedByTimestamp[timestamp]?.reduce((acc, e) => acc + e.value, 0) ?? 0
      if (!chartData[timestamp]) {
        chartData[timestamp] = {
          stablecoins: {},
          ether: {},
        }
      }
      chartData[timestamp].ether[id] = value
    }
  }

  const chart = Object.entries(chartData).map(([timestamp, values]) => {
    return [+timestamp, values.stablecoins, values.ether] as const
  })

  const etherData = chart.at(-1)?.[2] ?? {}
  const etherData7dAgo = chart.at(-7)?.[2] ?? {}

  const stablecoinsData = chart.at(-1)?.[1] ?? {}
  const stablecoinsData7dAgo = chart.at(-7)?.[1] ?? {}

  return {
    chart,
    ether: Object.fromEntries(
      Object.entries(etherData).map(([symbol, value]) => {
        const sevenDaysAgoValue = etherData7dAgo[symbol] ?? 0
        return [
          symbol,
          {
            value,
            change: calculatePercentageChange(value, sevenDaysAgoValue),
          },
        ]
      }),
    ),
    stablecoins: Object.fromEntries(
      Object.entries(stablecoinsData).map(([symbol, value]) => {
        const sevenDaysAgoValue = stablecoinsData7dAgo[symbol] ?? 0
        return [
          symbol,
          {
            value,
            change: calculatePercentageChange(value, sevenDaysAgoValue),
          },
        ]
      }),
    ),
    syncedUntil: UnixTime.now(),
  }
}

function sumBySymbol(values: (TokenValueRecord & { symbol: string })[]) {
  const groupedBySymbol = groupBy(values, (e) => e.symbol)
  const result: Record<string, { timestamp: number; value: number }[]> = {}
  for (const [symbol, values] of Object.entries(groupedBySymbol)) {
    const valuesResult: Record<number, number> = {}
    for (const value of values) {
      valuesResult[value.timestamp] =
        (valuesResult[value.timestamp] ?? 0) + value.valueForSummary
    }
    result[symbol] = Object.entries(valuesResult).map(([timestamp, value]) => ({
      timestamp: +timestamp,
      value,
    }))
  }
  return result
}
