import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import type { ChartRange } from '~/utils/range/range'
import { getLiquidStakingOverview } from '../defi/liquid-staking/getLiquidStakingOverview'
import { getLiquidStakingStakedEth } from '../defi/liquid-staking/getLiquidStakingStakedEth'
import {
  computeSeriesChange,
  EMPTY_HOME_KPI,
  getLatestValue,
  type HomeKpi,
  type HomeSeriesPoint,
  toWeeklySparkline,
} from './homeSeries'

export interface HomeLiquidStaking {
  /** Balance of all active validators, a level like TVS. */
  ethStaked: HomeKpi
  /** By TVL, as the liquid staking page lists them. */
  protocols: HomeLiquidStakingProtocol[]
}

export interface HomeLiquidStakingProtocol {
  id: string
  name: string
  shortName?: string
  href: string
  iconUrl: string
  /**
   * The ETH its tokens stand for, as a share of all ETH staked on the same
   * day. Absent when either is missing.
   */
  stakeShare?: number
  totalValueLockedUsd?: number
  /** Annualised, e.g. 0.028. */
  yield?: number
}

export const EMPTY_HOME_LIQUID_STAKING: HomeLiquidStaking = {
  ethStaked: EMPTY_HOME_KPI,
  protocols: [],
}

/**
 * The Ethereum card's stake and liquid staking ranking. The ranking's rows
 * lead to DeFi pages, so it follows their flag, and so does the stake, which
 * the same indexers read.
 */
export async function getHomeLiquidStaking(
  range: ChartRange,
): Promise<HomeLiquidStaking> {
  if (!env.CLIENT_SIDE_DEFI_ENABLED) return EMPTY_HOME_LIQUID_STAKING
  const [ethStaked, overview] = await Promise.all([
    getEthStakedKpi(range),
    getLiquidStakingOverview(),
  ])
  // The protocols' ETH at the day ETH staked was last read, so each share
  // divides by the stake of that day.
  const stakedOn = overview.ethStaked
  const stakedEth = stakedOn
    ? await getLiquidStakingStakedEth(
        overview.entries.map((entry) => entry.id),
        UnixTime(stakedOn.timestamp),
      )
    : new Map<string, number>()

  return {
    ethStaked,
    protocols: overview.entries.map((entry) => {
      const staked = stakedEth.get(entry.id)
      return {
        id: entry.id,
        name: entry.name,
        shortName: entry.shortName,
        href: entry.href,
        iconUrl: entry.icon,
        stakeShare:
          stakedOn && staked !== undefined
            ? staked / stakedOn.value
            : undefined,
        totalValueLockedUsd: entry.totalValueLockedUsd,
        yield: entry.yield?.value,
      }
    }),
  }
}

async function getEthStakedKpi(range: ChartRange): Promise<HomeKpi> {
  const to = UnixTime.toStartOf(UnixTime(range[1]), 'day')
  const from = UnixTime.toStartOf(
    UnixTime(range[0] ?? to - 365 * UnixTime.DAY),
    'day',
  )

  const byDay = env.MOCK
    ? getMockEthStaked(from, to)
    : new Map(
        (await getDb().ethereumStakingDaily.getInRange(from, to)).map((r) => [
          r.timestamp,
          Number(r.activeBalance / 10n ** 9n) / 1e9,
        ]),
      )
  const days = [...byDay.keys()].sort((a, b) => a - b)
  const first = days.at(0)
  const last = days.at(-1)
  if (first === undefined || last === undefined) return EMPTY_HOME_KPI

  const series = generateTimestamps(
    [UnixTime(first), UnixTime(last)],
    'day',
  ).map((day): HomeSeriesPoint => [day, byDay.get(day) ?? null])
  return {
    chart: toWeeklySparkline(series, { perDay: false }),
    value: getLatestValue(series),
    change: computeSeriesChange(series),
  }
}

/** A slow climb with some noise, like the real stake. */
function getMockEthStaked(from: UnixTime, to: UnixTime): Map<number, number> {
  const days = generateTimestamps([from, to], 'day')
  let value = 32_000_000
  return new Map(
    days.map((day) => {
      value += 6_000 + (Math.random() - 0.5) * 30_000
      return [day, value]
    }),
  )
}
