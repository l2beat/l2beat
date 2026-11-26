import { v } from '@l2beat/validate'
import { ChartRange } from '~/utils/range/range'
import { GAS_FEES_CHAINS, type GasFeesChainId } from './chains'
import {
  type GasFeesRecords,
  getGasFeesRecords,
  getRangeDays,
  getStoredDays,
} from './getGasFeesRecords'
import { type GasFeesTotals, inRange, median, summarize } from './summarize'
import {
  GAS_FEES_PERIOD_METRICS,
  type GasFeesPeriodMetric,
  type GasFeesRecord,
} from './types'

export const GasFeesSummaryParams = v.object({ range: ChartRange })
export type GasFeesSummaryParams = v.infer<typeof GasFeesSummaryParams>

export interface GasFeesSummaryRow
  extends Record<GasFeesPeriodMetric, number | null> {
  id: GasFeesChainId
  gasToken: string
  totalFees: number
  /** Days of the range the chain has no data for, so its totals leave them out */
  missingDays: number
  split: {
    base: number
    /** null on chains without priority fees */
    priority: number | null
    l1Data: number
  }
  /** Ethereum's value over the same days divided by this chain's, null for Ethereum */
  timesCheaper: Record<GasFeesPeriodMetric, number | null> | null
  /** Ethereum's value over those same days: what timesCheaper is against. null for Ethereum */
  ethereumSameDays: Record<GasFeesPeriodMetric, number | null> | null
}

export interface GasFeesSummary {
  /** Chains with data in the range, Ethereum first */
  rows: GasFeesSummaryRow[]
  /** Chains with no data in the range */
  noDataIds: GasFeesChainId[]
  /** The newest day stored for any chain, whatever the range */
  lastDay: number | undefined
  stats: {
    ethereum: { txCount: number; fees: number }
    /** Every chain but Ethereum */
    l2s: {
      txCount: number
      fees: number
      /** USD paid in each gas token, most first */
      feesByToken: { token: string; fees: number }[]
    }
    /** The cost of an ERC-20 transfer on Ethereum's latest day, whatever the range */
    latestErc20:
      | {
          timestamp: number
          ethereum: number
          /** The median of the L2s' costs that day */
          l2s: number
        }
      | undefined
  }
}

export async function getGasFeesSummary(
  params: GasFeesSummaryParams,
): Promise<GasFeesSummary> {
  return buildGasFeesSummary(await getGasFeesRecords(), params)
}

export function buildGasFeesSummary(
  records: GasFeesRecords,
  { range }: GasFeesSummaryParams,
): GasFeesSummary {
  const ethereum = records.get('ethereum') ?? []
  const expectedDays = getRangeDays(records, range).length

  const rows: GasFeesSummaryRow[] = []
  const noDataIds: GasFeesChainId[] = []
  const l2s = { txCount: 0, fees: 0 }
  const feesByToken = new Map<string, number>()
  let ethereumTotals: GasFeesTotals | undefined
  for (const chain of GAS_FEES_CHAINS) {
    const days = inRange(records.get(chain.id) ?? [], range)
    const totals = summarize(days)
    if (!totals) {
      noDataIds.push(chain.id)
      continue
    }
    if (chain.id === 'ethereum') {
      ethereumTotals = totals
    } else {
      l2s.txCount += totals.txCount
      l2s.fees += totals.totalFees
      feesByToken.set(
        chain.gasToken,
        (feesByToken.get(chain.gasToken) ?? 0) + totals.totalFees,
      )
    }
    rows.push({
      id: chain.id,
      gasToken: chain.gasToken,
      avgFee: totals.avgFee,
      transfer: totals.transfer,
      erc20: totals.erc20,
      swap: totals.swap,
      totalFees: totals.totalFees,
      missingDays: Math.max(0, expectedDays - totals.days),
      split: {
        base: totals.baseFees,
        priority: totals.priorityFees,
        l1Data: totals.l1DataFees,
      },
      ...(chain.id === 'ethereum'
        ? { timesCheaper: null, ethereumSameDays: null }
        : compareOverSharedDays(ethereum, days)),
    })
  }

  return {
    rows,
    noDataIds,
    lastDay: getStoredDays(records)?.last,
    stats: {
      ethereum: {
        txCount: ethereumTotals?.txCount ?? 0,
        fees: ethereumTotals?.totalFees ?? 0,
      },
      l2s: {
        ...l2s,
        feesByToken: [...feesByToken]
          .map(([token, fees]) => ({ token, fees }))
          .sort((a, b) => b.fees - a.fees),
      },
      latestErc20: getLatestErc20(records),
    },
  }
}

/** Each metric over the days both have a value for, so neither side counts a day the other lacks */
function compareOverSharedDays(
  ethereum: GasFeesRecord[],
  days: GasFeesRecord[],
) {
  const theirDays = new Map(ethereum.map((r) => [r.timestamp, r]))
  const nothing = { avgFee: null, transfer: null, erc20: null, swap: null }
  const timesCheaper: Record<GasFeesPeriodMetric, number | null> = {
    ...nothing,
  }
  const ethereumSameDays: Record<GasFeesPeriodMetric, number | null> = {
    ...nothing,
  }
  for (const metric of GAS_FEES_PERIOD_METRICS) {
    const hasValue = (r: GasFeesRecord) =>
      metric === 'avgFee' ? r.txCount > 0 : r[metric] !== null
    const ours: GasFeesRecord[] = []
    const theirs: GasFeesRecord[] = []
    for (const day of days) {
      const their = theirDays.get(day.timestamp)
      if (!their || !hasValue(day) || !hasValue(their)) continue
      ours.push(day)
      theirs.push(their)
    }
    const our = summarize(ours)?.[metric]
    const their = summarize(theirs)?.[metric]
    ethereumSameDays[metric] = their ?? null
    timesCheaper[metric] = our && their ? their / our : null
  }
  return { timesCheaper, ethereumSameDays }
}

function getLatestErc20(
  records: GasFeesRecords,
): GasFeesSummary['stats']['latestErc20'] {
  const latest = records.get('ethereum')?.findLast((r) => r.erc20 !== null)
  if (!latest || latest.erc20 === null) return undefined
  const l2s: number[] = []
  for (const [id, chain] of records) {
    if (id === 'ethereum') continue
    const erc20 = chain.find((r) => r.timestamp === latest.timestamp)?.erc20
    if (erc20 !== null && erc20 !== undefined) l2s.push(erc20)
  }
  const l2Median = median(l2s)
  if (l2Median === undefined) return undefined
  return { timestamp: latest.timestamp, ethereum: latest.erc20, l2s: l2Median }
}
