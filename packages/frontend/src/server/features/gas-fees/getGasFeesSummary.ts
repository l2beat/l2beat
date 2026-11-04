import { v } from '@l2beat/validate'
import { ChartRange } from '~/utils/range/range'
import { GAS_FEES_CHAINS, type GasFeesChainId, type GasUnit } from './chains'
import { getMockGasFees } from './mock/getMockGasFees'
import { type GasFeesTotals, inRange, summarize } from './summarize'
import type { GasFeesRecord } from './types'

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
  /** Ethereum's avg fee over the same days divided by this chain's, null for Ethereum */
  timesCheaper: number | null
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
    ethereumAvgFee: GasFeesStat
    /** Per transaction, over days with a split (since London) */
    ethereumBaseFee: GasFeesStat
    ethereumPriorityFee: GasFeesStat
    /** True when the range starts before London, so the split covers part of it */
    splitIsPartial: boolean
    /** Gwei per gas */
    ethereumGasPrice: GasFeesStat
    ethereumBaseFeePerGas: GasFeesStat
    ethereumPriorityFeePerGas: GasFeesStat
  }
}

interface GasFeesStat {
  value: number | undefined
  /** The same figure for the previous period of equal length, undefined for max */
  previous: number | undefined
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

  return {
    rows,
    notLiveIds,
    stats: getStats(data, range, previousRange),
  }
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
  return sameDays ? sameDays.avgFee / totals.avgFee : null
}

function getStats(
  data: Map<GasFeesChainId, GasFeesRecord[]>,
  range: ChartRange,
  previousRange: ChartRange | undefined,
): GasFeesSummary['stats'] {
  const current = getPeriodStats(data, range)
  const previous = previousRange && getPeriodStats(data, previousRange)
  const stat = (key: Exclude<keyof typeof current, 'splitIsPartial'>) => ({
    value: current[key],
    previous: previous?.[key],
  })
  return {
    ethereumAvgFee: stat('ethereumAvgFee'),
    ethereumBaseFee: stat('ethereumBaseFee'),
    ethereumPriorityFee: stat('ethereumPriorityFee'),
    splitIsPartial: current.splitIsPartial,
    ethereumGasPrice: stat('ethereumGasPrice'),
    ethereumBaseFeePerGas: stat('ethereumBaseFeePerGas'),
    ethereumPriorityFeePerGas: stat('ethereumPriorityFeePerGas'),
  }
}

function getPeriodStats(
  data: Map<GasFeesChainId, GasFeesRecord[]>,
  range: ChartRange,
) {
  const ethereum = summarize(inRange(data.get('ethereum') ?? [], range))
  const perSplitTx = (fees: number | null | undefined) =>
    ethereum?.splitTxCount && fees !== null && fees !== undefined
      ? fees / ethereum.splitTxCount
      : undefined
  return {
    ethereumAvgFee: ethereum?.avgFee,
    ethereumBaseFee: perSplitTx(ethereum?.baseFees),
    ethereumPriorityFee: perSplitTx(ethereum?.priorityFees),
    splitIsPartial: (ethereum?.unsplitFees ?? 0) > 0,
    ethereumGasPrice: ethereum?.gasPrice,
    ethereumBaseFeePerGas: ethereum?.baseFeePerGas ?? undefined,
    ethereumPriorityFeePerGas: ethereum?.priorityFeePerGas ?? undefined,
  }
}
