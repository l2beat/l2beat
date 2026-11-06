import { v } from '@l2beat/validate'
import { ChartRange } from '~/utils/range/range'
import { GAS_FEES_CHAINS, type GasFeesChainId, type GasUnit } from './chains'
import { getMockGasFees } from './mock/getMockGasFees'
import { type GasFeesTotals, inRange, median, summarize } from './summarize'
import {
  GAS_FEES_USD_METRICS,
  type GasFeesRecord,
  type GasFeesUsdMetric,
} from './types'

export const GasFeesSummaryParams = v.object({ range: ChartRange })
export type GasFeesSummaryParams = v.infer<typeof GasFeesSummaryParams>

export interface GasFeesSummaryRow {
  id: GasFeesChainId
  gasToken: string
  gasUnit: GasUnit
  avgFee: number
  /** Avg fee vs the previous period, null when the chain wasn't live for all of it */
  avgFeeChange: number | null
  medianFee: number
  transfer: number
  erc20: number
  swap: number
  totalFees: number
  txCount: number
  split: {
    base: number
    /** null on chains without priority fees */
    priority: number | null
    l1Data: number
    /** Ethereum before London has no base/priority split */
    unsplit: number
  }
  /** Ethereum's value over the same days divided by this chain's, null for Ethereum */
  timesCheaper: Record<GasFeesUsdMetric, number> | null
  /** Per gas in gasUnit */
  gas: {
    price: number
    /** Gas price vs the previous period, null like avgFeeChange */
    priceChange: number | null
    base: number | null
    priority: number | null
  }
}

export interface GasFeesSummary {
  /** Chains with data in the range, Ethereum first */
  rows: GasFeesSummaryRow[]
  /** Chains that launched after the range */
  notLiveIds: GasFeesChainId[]
  stats: {
    ethereum: { txCount: number; fees: number }
    /** Every chain but Ethereum */
    l2s: {
      txCount: number
      fees: number
      l1DataFees: number
      /** USD paid in each gas token, most first */
      feesByToken: { token: string; fees: number }[]
    }
    /** The cost of an ERC-20 transfer on the latest day, whatever the range */
    latestErc20: {
      timestamp: number
      ethereum: number
      /** The median of the L2s' costs */
      l2s: number
    }
  }
}

export function getGasFeesSummary({
  range,
}: GasFeesSummaryParams): GasFeesSummary {
  // A Dune snapshot until fees are tracked: see getMockGasFees
  const data = getMockGasFees()
  const ethereum = data.get('ethereum') ?? []
  const current = inRange(ethereum, range)
  const firstDay = current[0]?.timestamp
  const previousRange: ChartRange | undefined =
    range[0] === null || firstDay === undefined
      ? undefined
      : [firstDay - (range[1] - firstDay), firstDay]

  const rows: GasFeesSummaryRow[] = []
  const notLiveIds: GasFeesChainId[] = []
  for (const chain of GAS_FEES_CHAINS) {
    const records = data.get(chain.id) ?? []
    const totals = summarize(inRange(records, range))
    if (!totals) {
      notLiveIds.push(chain.id)
      continue
    }
    const previous = previousRange && summarize(inRange(records, previousRange))
    const previousIsComplete =
      previous !== undefined &&
      previousRange !== undefined &&
      previous.days === inRange(ethereum, previousRange).length
    const isComparable = previousIsComplete && previous
    rows.push({
      id: chain.id,
      gasToken: chain.gasToken,
      gasUnit: chain.gasUnit,
      avgFee: totals.avgFee,
      avgFeeChange: isComparable ? totals.avgFee / previous.avgFee - 1 : null,
      medianFee: totals.medianFee,
      transfer: totals.transfer,
      erc20: totals.erc20,
      swap: totals.swap,
      totalFees: totals.totalFees,
      txCount: totals.txCount,
      split: {
        base: totals.baseFees ?? 0,
        priority: totals.priorityFees,
        l1Data: totals.l1DataFees,
        unsplit: totals.unsplitFees,
      },
      timesCheaper:
        chain.id === 'ethereum'
          ? null
          : timesCheaper(ethereum, records, range, totals),
      gas: {
        price: totals.gasPrice,
        priceChange: isComparable
          ? totals.gasPrice / previous.gasPrice - 1
          : null,
        base: totals.baseFeePerGas,
        priority: totals.priorityFeePerGas,
      },
    })
  }

  return { rows, notLiveIds, stats: getStats(data, range) }
}

/** Compared over the days the chain was live, not Ethereum's whole range */
function timesCheaper(
  ethereum: GasFeesRecord[],
  records: GasFeesRecord[],
  range: ChartRange,
  totals: GasFeesTotals,
) {
  const days = new Set(inRange(records, range).map((r) => r.timestamp))
  const sameDays = summarize(ethereum.filter((r) => days.has(r.timestamp)))
  if (!sameDays) return null
  return Object.fromEntries(
    GAS_FEES_USD_METRICS.map((m) => [m, sameDays[m] / totals[m]]),
  ) as Record<GasFeesUsdMetric, number>
}

function getStats(
  data: Map<GasFeesChainId, GasFeesRecord[]>,
  range: ChartRange,
): GasFeesSummary['stats'] {
  const ethereum = summarize(inRange(data.get('ethereum') ?? [], range))
  const l2s = { txCount: 0, fees: 0, l1DataFees: 0 }
  const feesByToken = new Map<string, number>()
  const latestErc20: number[] = []
  for (const chain of GAS_FEES_CHAINS) {
    if (chain.id === 'ethereum') continue
    const records = data.get(chain.id) ?? []
    const latest = records.at(-1)
    if (latest) latestErc20.push(latest.erc20)
    const totals = summarize(inRange(records, range))
    if (!totals) continue
    l2s.txCount += totals.txCount
    l2s.fees += totals.totalFees
    l2s.l1DataFees += totals.l1DataFees
    feesByToken.set(
      chain.gasToken,
      (feesByToken.get(chain.gasToken) ?? 0) + totals.totalFees,
    )
  }
  const latestEthereum = data.get('ethereum')?.at(-1)
  return {
    ethereum: {
      txCount: ethereum?.txCount ?? 0,
      fees: ethereum?.totalFees ?? 0,
    },
    l2s: {
      ...l2s,
      feesByToken: [...feesByToken]
        .map(([token, fees]) => ({ token, fees }))
        .sort((a, b) => b.fees - a.fees),
    },
    latestErc20: {
      timestamp: latestEthereum?.timestamp ?? 0,
      ethereum: latestEthereum?.erc20 ?? 0,
      l2s: median(latestErc20) ?? 0,
    },
  }
}
