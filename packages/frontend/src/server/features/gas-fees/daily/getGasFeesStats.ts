import { UnixTime } from '@l2beat/shared-pure'
import { type GasFeesChainId, type GasToken, gasTokenOf } from '../chains'
import { pastYear } from '../days'
import { median, sum } from '../math'
import { type GasFeesDay, getGasFeesDays } from './getGasFeesDays'
import { avgFee, getDayValues } from './metrics'
import { summarizeChains } from './summarizeChains'

/** The newest stored day may trail the last complete day by this much */
const MAY_TRAIL_DAYS = 1

export interface GasFeesStats {
  from: number
  to: number
  /** L2s with data in the period */
  l2Count: number
  txCount: { l2s: number; ethereum: number }
  feesUsd: { l2s: number; ethereum: number }
  /** The L2s' part of both sides' transactions and fees; 0 without any */
  l2Share: { txCount: number; feesUsd: number }
  l2FeesUsdByToken: Record<GasToken, number>
  /** Fees over transactions, over the days both Ethereum and an L2 have */
  avgFee: { l2s: number; ethereum: number } | undefined
  latestErc20: LatestErc20 | undefined
  /** undefined while the newest stored day is recent */
  staleSince: number | undefined
  missingDays: { chain: GasFeesChainId; days: number }[]
}

/** Ethereum's newest day against the L2s that have a cost that day */
interface LatestErc20 {
  day: number
  ethereum: number
  l2Median: number
  l2Count: number
}

/** A fixed past year up to yesterday, whatever the cards' ranges */
export async function getGasFeesStats(
  now = UnixTime.now(),
): Promise<GasFeesStats> {
  const [from, to] = pastYear(now)
  const days = await getGasFeesDays(from, to)
  return toGasFeesStats(days, from, to)
}

export function toGasFeesStats(
  days: GasFeesDay[],
  from: UnixTime,
  to: UnixTime,
): GasFeesStats {
  const chains = summarizeChains(days, from)
  const l2s = chains.filter((c) => c.chain !== 'ethereum' && c.hasData)
  const ethereum = chains.find((c) => c.chain === 'ethereum')
  const l2FeesUsdByToken: Record<GasToken, number> = { ETH: 0, MNT: 0 }
  for (const c of l2s) l2FeesUsdByToken[gasTokenOf(c.chain)] += c.feesUsd
  const newest = days.at(-1)?.timestamp
  const txCount = {
    l2s: sum(l2s.map((c) => c.txCount)),
    ethereum: ethereum?.txCount ?? 0,
  }
  const feesUsd = {
    l2s: sum(l2s.map((c) => c.feesUsd)),
    ethereum: ethereum?.feesUsd ?? 0,
  }
  const l2ShareOf = (side: { l2s: number; ethereum: number }) =>
    side.l2s + side.ethereum > 0 ? side.l2s / (side.l2s + side.ethereum) : 0
  return {
    from,
    to,
    l2Count: l2s.length,
    txCount,
    feesUsd,
    l2Share: { txCount: l2ShareOf(txCount), feesUsd: l2ShareOf(feesUsd) },
    l2FeesUsdByToken,
    avgFee: getAvgFees(days),
    latestErc20: getLatestErc20(days),
    staleSince:
      newest === undefined || to - newest > MAY_TRAIL_DAYS * UnixTime.DAY
        ? newest
        : undefined,
    missingDays: chains
      .filter((c) => c.missingDays > 0)
      .map((c) => ({ chain: c.chain, days: c.missingDays })),
  }
}

function getAvgFees(days: GasFeesDay[]): GasFeesStats['avgFee'] {
  const byDay = Map.groupBy(
    days.filter((d) => d.txCount > 0),
    (d) => d.timestamp,
  )
  const shared = [...byDay.values()].filter(
    (dayRows) =>
      dayRows.length >= 2 && dayRows.some((d) => d.chain === 'ethereum'),
  )
  const l2s = avgFee(shared.flat().filter((d) => d.chain !== 'ethereum'))
  const ethereum = avgFee(shared.flat().filter((d) => d.chain === 'ethereum'))
  return l2s === null || ethereum === null ? undefined : { l2s, ethereum }
}

function getLatestErc20(days: GasFeesDay[]): LatestErc20 | undefined {
  const ethereumDays = days.filter((d) => d.chain === 'ethereum').reverse()
  for (const eth of ethereumDays) {
    const ethereum = getDayValues(eth).erc20
    if (ethereum === null) continue
    const l2Costs = days
      .filter((d) => d.timestamp === eth.timestamp && d.chain !== 'ethereum')
      .flatMap((d) => getDayValues(d).erc20 ?? [])
    const l2Median = median(l2Costs)
    if (l2Median === null) continue
    return { day: eth.timestamp, ethereum, l2Median, l2Count: l2Costs.length }
  }
  return undefined
}
