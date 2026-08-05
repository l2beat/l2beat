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

export interface GetBlockNumberAtOrBeforeOptions {
  // Non-archive nodes prune old blocks and report them as missing, which
  // would otherwise abort the search as soon as a probe lands below the
  // pruning horizon. With this flag a failed probe is treated as "below the
  // horizon" and the search continues above it. The result stays exact: a
  // block number is only returned when both final neighbors were actually
  // fetched, and if the boundary block itself is unavailable the search
  // throws because the requested timestamp precedes the available history.
  tolerateMissingBlocks?: boolean
}

export async function getBlockNumberAtOrBefore(
  timestamp: UnixTime,
  lhsBlock: number,
  rhsBlock: number,
  getBlock: (number: number) => Promise<{ timestamp: number }>,
  options?: GetBlockNumberAtOrBeforeOptions,
): Promise<number> {
  const getTimestamp = async (block: number): Promise<number | undefined> => {
    if (!options?.tolerateMissingBlocks) {
      return (await getBlock(block)).timestamp
    }
    try {
      return (await getBlock(block)).timestamp
    } catch {
      return undefined
    }
  }

  let [lhsTimestamp, { timestamp: rhsTimestamp }] = await Promise.all([
    getTimestamp(lhsBlock),
    getBlock(rhsBlock),
  ])

  if (lhsTimestamp !== undefined && timestamp <= lhsTimestamp) return lhsBlock
  if (timestamp >= rhsTimestamp) return rhsBlock

  while (lhsBlock + 1 < rhsBlock) {
    const rangeBefore = rhsBlock - lhsBlock

    // Interpolation step, requires a known lhs timestamp
    if (lhsTimestamp !== undefined) {
      const blockTime = (rhsTimestamp - lhsTimestamp) / (rhsBlock - lhsBlock)
      const blocksFromStart = Math.round((timestamp - lhsTimestamp) / blockTime)
      const guess = Math.max(
        lhsBlock + 1,
        Math.min(rhsBlock - 1, lhsBlock + blocksFromStart),
      )
      const guessTs = await getTimestamp(guess)

      if (guessTs === undefined || guessTs <= timestamp) {
        lhsBlock = guess
        lhsTimestamp = guessTs
      } else {
        rhsBlock = guess
        rhsTimestamp = guessTs
      }
    }

    // Safety net: only pay for a binary step if interpolation failed to halve
    // the range (or could not run because the lhs timestamp is unknown)
    if (rhsBlock - lhsBlock > rangeBefore / 2 && lhsBlock + 1 < rhsBlock) {
      const mid = lhsBlock + Math.floor((rhsBlock - lhsBlock) / 2)
      const midTs = await getTimestamp(mid)
      if (midTs === undefined || midTs <= timestamp) {
        lhsBlock = mid
        lhsTimestamp = midTs
      } else {
        rhsBlock = mid
        rhsTimestamp = midTs
      }
    }
  }

  if (lhsTimestamp === undefined) {
    throw new Error(
      `Block ${lhsBlock} is unavailable on this RPC, ` +
        `timestamp ${timestamp} precedes its available history`,
    )
  }
  return lhsBlock
}
