// NOTE(radomski): Not all chains have access to an explorer capable of finding
// the closest block at a given timestamp. Since all blocks are produced
// sequentially their timestamp is a sorted list we can binary search through.
// Binary search guarantees us that it will take O(log2(blockCount)) iterations.
// These iterations are blocking, each one will do a request to the node.
//
// We can observe that since we know the starting timestamp and ending
// timestamp and how many blocks where produced in between it's trivial for us
// to approximate the block time. Having that we can guess at which block the
// timestamp we are looking for is in.
//
// But doing just that is not enough because we're always searching from the
// start and block times are the start are very irregular so we want to narrow
// the search range as fast as possible to have the highest resolution on our
// range. Tested empirically first guessing and later doing a single step of
// binary search gives us the least amount of calls to the node. On average it

import type { UnixTime } from '@l2beat/shared-pure'

// takes 2-3x less calls to get to the same result.
export async function getBlockNumberSwitching(
  timestamp: UnixTime,
  lhsBlock: number,
  rhsBlock: number,
  getBlockTimestamp: (number: number) => Promise<number>,
): Promise<number> {
  let [lhsTimestamp, rhsTimestamp] = await Promise.all([
    getBlockTimestamp(lhsBlock),
    getBlockTimestamp(rhsBlock),
  ])

  if (timestamp <= lhsTimestamp) return lhsBlock
  if (timestamp >= rhsTimestamp) return rhsBlock

  while (lhsBlock + 1 < rhsBlock) {
    const blockTime = (rhsTimestamp - lhsTimestamp) / (rhsBlock - lhsBlock)
    const blocksFromStart = Math.round(timestamp - lhsTimestamp / blockTime)
    const guessedBlockNumber = Math.max(
      lhsBlock + 1,
      Math.min(rhsBlock - 1, lhsBlock + blocksFromStart),
    )

    const guessedBlockTimestamp = await getBlockTimestamp(guessedBlockNumber)

    if (guessedBlockTimestamp <= timestamp) {
      lhsBlock = guessedBlockNumber
      lhsTimestamp = guessedBlockTimestamp
    } else {
      rhsBlock = guessedBlockNumber
      rhsTimestamp = guessedBlockTimestamp
    }

    const midBlockNumber = lhsBlock + Math.floor((rhsBlock - lhsBlock) / 2)
    const midTimestamp = await getBlockTimestamp(midBlockNumber)
    if (midTimestamp <= timestamp) {
      lhsBlock = midBlockNumber
      lhsTimestamp = midTimestamp
    } else {
      rhsBlock = midBlockNumber
      rhsTimestamp = midTimestamp
    }
  }

  return lhsBlock
}
