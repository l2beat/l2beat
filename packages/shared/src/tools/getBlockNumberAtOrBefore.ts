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
// takes 2.5-4x less calls to get to the same result.
//
// The approach is to interpolate the block number for as long as we are
// halving the block range we are looking into. If we get stuck and fail to at
// least halve the range we are going to fallback to the binary seach step.

import type { UnixTime } from '@l2beat/shared-pure'

export async function getBlockNumberAtOrBefore(
  timestamp: UnixTime,
  lhsBlock: number,
  rhsBlock: number,
  getBlock: (number: number) => Promise<{ timestamp: number }>,
): Promise<number> {
  let [{ timestamp: lhsTimestamp }, { timestamp: rhsTimestamp }] =
    await Promise.all([getBlock(lhsBlock), getBlock(rhsBlock)])

  if (timestamp <= lhsTimestamp) return lhsBlock
  if (timestamp >= rhsTimestamp) return rhsBlock

  while (lhsBlock + 1 < rhsBlock) {
    const rangeBefore = rhsBlock - lhsBlock

    // Interpolation step
    const blockTime = (rhsTimestamp - lhsTimestamp) / (rhsBlock - lhsBlock)
    const blocksFromStart = Math.round((timestamp - lhsTimestamp) / blockTime)
    const guess = Math.max(
      lhsBlock + 1,
      Math.min(rhsBlock - 1, lhsBlock + blocksFromStart),
    )
    const { timestamp: guessTs } = await getBlock(guess)

    if (guessTs <= timestamp) {
      lhsBlock = guess
      lhsTimestamp = guessTs
    } else {
      rhsBlock = guess
      rhsTimestamp = guessTs
    }

    // Safety net: only pay for a binary step if interpolation failed to halve
    // the range
    if (rhsBlock - lhsBlock > rangeBefore / 2 && lhsBlock + 1 < rhsBlock) {
      const mid = lhsBlock + Math.floor((rhsBlock - lhsBlock) / 2)
      const { timestamp: midTs } = await getBlock(mid)
      if (midTs <= timestamp) {
        lhsBlock = mid
        lhsTimestamp = midTs
      } else {
        rhsBlock = mid
        rhsTimestamp = midTs
      }
    }
  }
  return lhsBlock
}
