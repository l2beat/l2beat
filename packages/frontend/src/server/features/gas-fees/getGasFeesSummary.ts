import { v } from '@l2beat/validate'
import { ChartRange } from '~/utils/range/range'
import { GAS_FEES_CHAINS, type GasFeesChainId } from './chains'
import { getMockGasFees } from './mock/getMockGasFees'
import { type GasFeesTotals, inRange, median, summarize } from './summarize'
import type { GasFeesRecord } from './types'

export const GasFeesSummaryParams = v.object({ range: ChartRange })
export type GasFeesSummaryParams = v.infer<typeof GasFeesSummaryParams>

export interface GasFeesSummaryRow {
  id: GasFeesChainId
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
}

export interface GasFeesSummary {
  /** Chains with data in the range, Ethereum first */
  rows: GasFeesSummaryRow[]
  /** Chains that launched after the range */
  notLiveIds: GasFeesChainId[]
  stats: {
    ethereumAvgFee: GasFeesStat
    typicalL2AvgFee: GasFeesStat
    l2sCheaperBy: GasFeesStat
    totalFees: GasFeesStat & { l2Share: number }
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
  // Fake data until fees are tracked: see getMockGasFees
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
    rows.push({
      id: chain.id,
      avgFee: totals.avgFee,
      avgFeeChange:
        previousIsComplete && previous
          ? totals.avgFee / previous.avgFee - 1
          : null,
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
  return {
    ethereumAvgFee: {
      value: current.ethereumAvgFee,
      previous: previous?.ethereumAvgFee,
    },
    typicalL2AvgFee: {
      value: current.typicalL2AvgFee,
      previous: previous?.typicalL2AvgFee,
    },
    l2sCheaperBy: {
      value: current.l2sCheaperBy,
      previous: previous?.l2sCheaperBy,
    },
    totalFees: {
      value: current.totalFees,
      previous: previous?.totalFees,
      l2Share: current.totalFees ? current.l2Fees / current.totalFees : 0,
    },
  }
}

function getPeriodStats(
  data: Map<GasFeesChainId, GasFeesRecord[]>,
  range: ChartRange,
) {
  const ethereumRecords = data.get('ethereum') ?? []
  const ethereum = summarize(inRange(ethereumRecords, range))
  const l2AvgFees: number[] = []
  const ratios: number[] = []
  let l2Fees = 0
  for (const chain of GAS_FEES_CHAINS) {
    if (chain.id === 'ethereum') continue
    const records = data.get(chain.id) ?? []
    const totals = summarize(inRange(records, range))
    if (!totals) continue
    l2AvgFees.push(totals.avgFee)
    l2Fees += totals.totalFees
    const ratio = timesCheaper(ethereumRecords, records, range, totals)
    if (ratio !== null) ratios.push(ratio)
  }
  return {
    ethereumAvgFee: ethereum?.avgFee,
    typicalL2AvgFee: median(l2AvgFees),
    l2sCheaperBy: median(ratios),
    totalFees: (ethereum?.totalFees ?? 0) + l2Fees,
    l2Fees,
  }
}
