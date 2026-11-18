import { UnixTime } from '@l2beat/shared-pure'
import type { GasFeesChain } from './chains'

export interface ChainDay {
  chain: GasFeesChain
  day: UnixTime
}

export interface LateRead {
  chains: GasFeesChain[]
  from: UnixTime
  to: UnixTime
}

/** A chain's day not on Dune in full is read again for this long after it. Then it stays missing */
const LATE_DAYS = 30

/**
 * The first day still read again. Counted from now, not from the days an
 * indexer is on, so a backfill can't run past a day that is still due.
 */
export function getDueFrom(now: UnixTime): UnixTime {
  return UnixTime(UnixTime.toStartOf(now, 'day') - LATE_DAYS * UnixTime.DAY)
}

/**
 * The chain-days from `from` to `to`, both included, that should be stored and
 * are not among `stored`, oldest first. A chain is expected from its `requiredFrom` on.
 */
export function getMissingChainDays(
  chains: GasFeesChain[],
  from: UnixTime,
  to: UnixTime,
  stored: { chain: string; timestamp: UnixTime }[],
): ChainDay[] {
  const have = new Set(stored.map((r) => `${r.chain}:${r.timestamp}`))
  const missing: ChainDay[] = []
  for (let day = from; day <= to; day = UnixTime(day + UnixTime.DAY)) {
    for (const chain of chains) {
      if (day >= chain.requiredFrom && !have.has(`${chain.id}:${day}`)) {
        missing.push({ chain, day })
      }
    }
  }
  return missing
}

/**
 * The reads that fill late chain-days, each at most `daysPerQuery` days wide,
 * so a day Dune never loads can't widen them: the newest late days, and the
 * oldest when they lie further back. Both, because a chain that is late every
 * day keeps the newest on the last days and would starve an older day until
 * it was no longer due. The days between are reached as the oldest fill.
 */
export function planLateReads(
  late: ChainDay[],
  daysPerQuery: number,
): LateRead[] {
  const days = late.map(({ day }) => day)
  if (days.length === 0) return []
  const oldest = Math.min(...days)
  const newest = Math.max(...days)
  const span = (daysPerQuery - 1) * UnixTime.DAY
  const newestFrom = Math.max(oldest, newest - span)
  const batches = [late.filter(({ day }) => day >= newestFrom)]
  if (oldest < newestFrom) {
    const oldestTo = Math.min(oldest + span, newestFrom - UnixTime.DAY)
    batches.push(late.filter(({ day }) => day <= oldestTo))
  }
  return batches.map((batch) => {
    const batchDays = batch.map(({ day }) => day)
    return {
      chains: [...new Set(batch.map(({ chain }) => chain))],
      from: UnixTime(Math.min(...batchDays)),
      to: UnixTime(Math.max(...batchDays)),
    }
  })
}
