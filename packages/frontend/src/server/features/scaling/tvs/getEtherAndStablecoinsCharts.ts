import type { TokenValueRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import groupBy from 'lodash/groupBy'
import partition from 'lodash/partition'
import { env } from '~/env'
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
  if (env.MOCK) {
    return getMockEtherAndStablecoinsChartsData({ range, filter })
  }

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

function getMockEtherAndStablecoinsChartsData({
  range,
  filter,
}: EtherAndStablecoinsChartsDataParams) {
  return {
    chart: [],
    ether: {
      ETH: { value: 8864283633.869999, change: -0.04954588312241537 },
      weETH: { value: 1653063636.1000004, change: -0.015420450596514756 },
      wstETH: { value: 903200688.0699999, change: 0.06293114058484783 },
      ezETH: { value: 374423138.35, change: 0.3528099365651882 },
      'cgETH.hashkey': { value: 134211512, change: -0.03626880112758657 },
      cbETH: { value: 116876501.05, change: -0.04671518833094335 },
      rsETH: { value: 98275875.79, change: 0.047723310296818644 },
      rETH: { value: 91380455.58999999, change: -0.06379378379670442 },
      vbETH: { value: 57946040, change: -0.02569869659673729 },
      frxETH: { value: 46221541.66, change: -0.03192918297600578 },
      sfrxETH: { value: 30553686.099999998, change: -0.03154747585302675 },
      FRAX: { value: 13511561.78, change: -0.00007687639354470033 },
      STONE: { value: 9446873.77, change: -0.035951938858710064 },
      WETH: { value: 2082371.29, change: -0.04482591407243863 },
      'ETH+': { value: 1254704.4, change: -0.09634380270619125 },
      pufETH: { value: 315040.31999999995, change: -0.06114470673631278 },
      wOETH: { value: 189905.31, change: -0.08038805860868303 },
      stETH: { value: 54381.93, change: -0.030981304197993498 },
      rswETH: { value: 40655.29, change: -0.01957673412258598 },
      uniETH: { value: 8011.91, change: -0.030591403964311037 },
      weETHs: { value: 5815.81, change: -0.027845058580266424 },
      cETH: { value: 1706.8700000000001, change: -0.03183777651730002 },
      cSTONE: { value: 1333.21, change: -0.02555238018667272 },
      mETH: { value: 931.81, change: -0.030505758846357978 },
      eETH: { value: 780.99, change: -0.02816007565764911 },
      ankrETH: { value: 193.32, change: 0.0034778094990914887 },
      pzETH: { value: 25.95, change: -0.032438478747203625 },
    },
    stablecoins: {
      USDC: { value: 12352033024.85, change: -0.007996118981635991 },
      USDT: { value: 1201931571.3500004, change: -0.032196687717301 },
      sUSDS: { value: 273990856, change: -0.028759944961604944 },
      wM: { value: 160942940, change: 0.3267407486789715 },
      'USD₮0': { value: 144655327, change: -0.007290992146365416 },
      USDX: { value: 118059480, change: 0.0020059728510013475 },
      vbUSDC: { value: 75887710, change: 0.012383225228246753 },
      DAI: { value: 58840716.74999999, change: 0.03166416226082491 },
      EURC: { value: 48013541.41, change: -0.003824693047434602 },
      USDS: { value: 42735121.07, change: -0.11780030913923656 },
      vbUSDT: { value: 21696184, change: -0.07585655691164916 },
      USDe: { value: 14251125.03, change: 5.4520886030285425 },
      sUSDe: { value: 12086257.379999999, change: 1.1535351096692725 },
      'USDC.e': { value: 11528343, change: -0.033852781244563035 },
      eUSD: { value: 9398778.88, change: -0.0175438784278793 },
      USR: { value: 7086950.58, change: 0.009580367664980605 },
      crvUSD: { value: 6741701.07, change: -0.04778326813335021 },
      oUSDT: { value: 4823416.53, change: -0.0042972166957484514 },
      GHO: { value: 3627873, change: 0.27202761392329955 },
      DOLA: { value: 3476364.51, change: -0.008235441467143612 },
      sUSDz: { value: 3033076.42, change: -0.00016310808750352734 },
      scrvUSD: { value: 1487866.72, change: 0.0010091924220931858 },
      LUSD: { value: 1471452.9000000001, change: -0.035098540281298996 },
      USDN: { value: 743135, change: -0.015193871510520318 },
      sDAI: { value: 290368.11000000004, change: -0.0029610570267956104 },
      eDLLR: { value: 199474.2, change: -0.00607305625277843 },
      sFRAX: { value: 189510.32, change: -0.0603247112862344 },
      TUSD: { value: 170057.22, change: -0.00024685593777884485 },
      USDD: { value: 170165.53, change: -0.0002156258469704353 },
      USDM: { value: 137266.83000000002, change: -0.009359377672507274 },
      RAI: { value: 116708.9, change: -0.009375499200176218 },
      BUSD: { value: 71679.04000000001, change: 0.001159701497332133 },
      'FRAX.legacy': { value: 30443.67, change: -0.00007685736160512047 },
      EURS: { value: 14217.539999999999, change: -0.002153951754007455 },
      GUSD: { value: 2466.58, change: 0.00030010057424645353 },
      USDP: { value: 2421.0200000000004, change: -0.00010738121985032212 },
      EURA: { value: 1119.79, change: 0.00822941520731102 },
      MIM: { value: 999.13, change: 0.0007111235752488287 },
      'rUSDC-stark': { value: 554.56, change: -0.9710970969927555 },
      deUSD: { value: 410.25, change: -0.0016061911367452053 },
      cUSDC: { value: 189.03000000000003, change: 0.0005292965648653336 },
      cDAI: { value: 61.2, change: -0.00032669062397905346 },
      vbUSDS: { value: 24.59, change: 0.00040683482506098656 },
      alUSD: { value: 9.92, change: -0.002012072434607548 },
      EURT: { value: 1.72, change: 0.005847953216374213 },
      wUSDM: { value: 1, change: 0 },
    },
    syncedUntil: UnixTime.now(),
  }
}
