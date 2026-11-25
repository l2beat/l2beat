import type { IRpcClient } from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import type { BlockFinder } from '../types'

export type BlockTimestampRpc = Pick<IRpcClient, 'getBlockTimestamp'>

const SLOT_SECONDS = 12

/**
 * The last block at or before each timestamp, ascending. The first comes from
 * the block finder's search; each next one is guessed from the one before, as
 * a block takes at most one slot, which costs a few reads instead of a search.
 */
export async function findLastBlocksBefore(
  finder: BlockFinder,
  rpc: BlockTimestampRpc,
  timestamps: UnixTime[],
): Promise<{ timestamp: UnixTime; blockNumber: number }[]> {
  const blocks: { timestamp: UnixTime; blockNumber: number }[] = []
  let known: { number: number; timestamp: number } | undefined
  for (const timestamp of timestamps) {
    let number = known
      ? known.number + Math.floor((timestamp - known.timestamp) / SLOT_SECONDS)
      : await finder.getBlockNumberAtOrBefore(timestamp)
    let at = await rpc.getBlockTimestamp(number)
    while (at > timestamp) {
      number -= Math.max(1, Math.floor((at - timestamp) / SLOT_SECONDS))
      at = await rpc.getBlockTimestamp(number)
    }
    for (;;) {
      const next = await rpc.getBlockTimestamp(number + 1)
      if (next > timestamp) break
      number++
      at = next
    }
    known = { number, timestamp: at }
    blocks.push({ timestamp, blockNumber: number })
  }
  return blocks
}
