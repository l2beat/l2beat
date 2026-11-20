import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import type { ChartRange } from '~/utils/range/range'
import { toEth } from '../defi/liquid-staking/computeLiquidStakingCharts'
import { MAX_STAKE_AGE } from '../defi/liquid-staking/getEthStakedAt'
import { getLiquidStakingOverview } from '../defi/liquid-staking/getLiquidStakingOverview'
import {
  computeSeriesChange,
  EMPTY_HOME_KPI,
  getLatestValue,
  type HomeKpi,
  type HomeSeriesPoint,
  toWeeklySparkline,
} from './homeSeries'

const TOP_PROTOCOLS_COUNT = 5
const LIQUID_STAKING_PATH = '/defi/liquid-staking'

export interface HomeLiquidStaking {
  /** ETH staked network-wide; the figure is the latest day's. */
  ethStaked: HomeKpi
  /** The largest protocols by TVL. */
  protocols: HomeLiquidStakingProtocol[]
}

export interface HomeLiquidStakingProtocol {
  id: string
  name: string
  href: string
  iconUrl: string
  /** Of the ETH staked network-wide. */
  stakedEthShare: number | undefined
  /** Annualised, over the past 30 days. */
  yield: number | undefined
}

export const EMPTY_HOME_LIQUID_STAKING: HomeLiquidStaking = {
  ethStaked: EMPTY_HOME_KPI,
  protocols: [],
}

export async function getHomeLiquidStaking(
  range: ChartRange,
): Promise<HomeLiquidStaking> {
  const [ethStaked, overview] = await Promise.all([
    getEthStakedKpi(range),
    getLiquidStakingOverview(),
  ])
  return {
    ethStaked,
    protocols: overview.entries.slice(0, TOP_PROTOCOLS_COUNT).map((entry) => ({
      id: entry.id,
      name: entry.shortName ?? entry.name,
      // An unreviewed protocol is only a row of the liquid staking page.
      href: entry.href ?? LIQUID_STAKING_PATH,
      iconUrl: entry.icon,
      stakedEthShare: entry.stakedEthShare?.value,
      yield: entry.yield?.value,
    })),
  }
}

async function getEthStakedKpi(range: ChartRange): Promise<HomeKpi> {
  const to = UnixTime.toStartOf(UnixTime(range[1]), 'day')
  const from = UnixTime(range[0] ?? to - 365 * UnixTime.DAY)
  const records = env.MOCK
    ? generateTimestamps([from, to], 'day').map((timestamp, i) => ({
        timestamp,
        value: 34_000_000 + i * 5_000,
      }))
    : (await getDb().ethereumStakingDaily.getInRange(from, to)).map(
        (record) => ({
          timestamp: record.timestamp,
          value: toEth(record.activeBalance),
        }),
      )

  const first = records.at(0)
  const last = records.at(-1)
  if (!first || !last) {
    return EMPTY_HOME_KPI
  }
  const valueByDay = new Map(records.map((r) => [r.timestamp, r.value]))
  // Up to the range's end, like the other home charts: a stale stake ends
  // short of the right edge instead of drawing its last day as today's.
  const chart = generateTimestamps([first.timestamp, to], 'day').map(
    (timestamp): HomeSeriesPoint => [
      timestamp,
      valueByDay.get(timestamp) ?? null,
    ],
  )
  // A stake older than the indexer's usual lag shows as missing, not as today's.
  const isFresh = UnixTime.now() - last.timestamp <= MAX_STAKE_AGE
  // The change is labelled with the range, so a shorter history has none.
  const coversRange = first.timestamp - from <= MAX_STAKE_AGE
  return {
    chart: toWeeklySparkline(chart, { perDay: false }),
    value: isFresh ? getLatestValue(chart) : undefined,
    change: isFresh && coversRange ? computeSeriesChange(chart) : undefined,
  }
}
