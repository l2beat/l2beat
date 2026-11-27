import { UnixTime } from '@l2beat/shared-pure'
import { GAS_FEES_CHAINS, type GasFeesChainId } from '../chains'
import { mean, sum } from '../math'
import { type FeeSplit, splitFees, usdPerToken } from './feeRules'
import type { GasFeesDay } from './getGasFeesDays'
import {
  type DayValues,
  getDayValues,
  PERIOD_METRICS,
  type PeriodMetric,
} from './metrics'

/** A chain's and Ethereum's figure over the days both have one */
export interface SharedDays {
  chain: number
  ethereum: number
}

export interface ChainSummary {
  chain: GasFeesChainId
  /** Fee-paying transactions */
  txCount: number
  feesUsd: number
  /** USD */
  split: FeeSplit
  /** Averages over the period: fees over transactions, or the mean of the days' action costs */
  costs: Record<PeriodMetric, number | null>
  /** Ethereum's own row has none */
  vsEthereum: Record<PeriodMetric, SharedDays | null> | undefined
  /** Days in the period without a row */
  missingDays: number
  hasData: boolean
}

interface ValuedDay {
  day: GasFeesDay
  values: DayValues
}

/** Missing days count up to the newest day stored for any chain */
export function summarizeChains(
  days: GasFeesDay[],
  from: UnixTime,
): ChainSummary[] {
  const last = days.at(-1)?.timestamp
  const span = last === undefined ? 0 : (last - from) / UnixTime.DAY + 1
  const byChain = Map.groupBy(
    days.map((day) => ({ day, values: getDayValues(day) })),
    (d) => d.day.chain,
  )
  const ethereum = new Map(
    (byChain.get('ethereum') ?? []).map((d) => [d.day.timestamp, d]),
  )
  return GAS_FEES_CHAINS.map((chain) => {
    const own = byChain.get(chain) ?? []
    return {
      chain,
      txCount: sum(own.map((d) => d.day.txCount)),
      feesUsd: sum(own.map((d) => d.day.totalFeeUsd)),
      split: sumSplits(own.map((d) => d.day)),
      costs: periodCosts(own),
      vsEthereum:
        chain === 'ethereum' ? undefined : compareWithEthereum(own, ethereum),
      missingDays: span - own.length,
      hasData: own.length > 0,
    }
  })
}

function periodCosts(days: ValuedDay[]): Record<PeriodMetric, number | null> {
  return Object.fromEntries(
    PERIOD_METRICS.map((metric) => [metric, periodCost(days, metric)]),
  ) as Record<PeriodMetric, number | null>
}

function periodCost(days: ValuedDay[], metric: PeriodMetric): number | null {
  if (metric === 'avgFee') {
    const txCount = sum(days.map((d) => d.day.txCount))
    return txCount > 0
      ? sum(days.map((d) => d.day.totalFeeUsd)) / txCount
      : null
  }
  return mean(days.flatMap((d) => d.values[metric] ?? []))
}

function compareWithEthereum(
  days: ValuedDay[],
  ethereum: Map<number, ValuedDay>,
): Record<PeriodMetric, SharedDays | null> {
  return Object.fromEntries(
    PERIOD_METRICS.map((metric) => {
      const pairs = days.flatMap((d) => {
        const eth = ethereum.get(d.day.timestamp)
        return eth && d.values[metric] !== null && eth.values[metric] !== null
          ? [{ chain: d, ethereum: eth }]
          : []
      })
      const chain = periodCost(
        pairs.map((p) => p.chain),
        metric,
      )
      const eth = periodCost(
        pairs.map((p) => p.ethereum),
        metric,
      )
      return [
        metric,
        chain === null || eth === null ? null : { chain, ethereum: eth },
      ]
    }),
  ) as Record<PeriodMetric, SharedDays | null>
}

function sumSplits(days: GasFeesDay[]): FeeSplit {
  let base = 0
  let priority: number | null = null
  let l1Data = 0
  for (const day of days) {
    const usd = usdPerToken(day) ?? 0
    const split = splitFees(day)
    base += split.base * usd
    l1Data += split.l1Data * usd
    if (split.priority !== null)
      priority = (priority ?? 0) + split.priority * usd
  }
  return { base, priority, l1Data }
}
