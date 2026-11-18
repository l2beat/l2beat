import type { IRpcClient } from '@l2beat/shared'

export type FeeHistoryRpc = Pick<IRpcClient, 'getFeeHistory'>

/** Most nodes return at most 1,024 blocks per eth_feeHistory */
const MAX_BLOCKS_PER_CALL = 1024

/**
 * Each block's tips at `percentiles`, gwei, for blocks `from` to `to`, both
 * included, oldest first. Fails on a block without a tip at every percentile:
 * read as 0, a missing tip would give a plausible wrong estimate.
 */
export async function readBlockTips(
  rpc: FeeHistoryRpc,
  from: number,
  to: number,
  percentiles: number[],
): Promise<number[][]> {
  const tips: number[][] = []
  // Newest first, one call after another: a node with a lower limit returns
  // the newest blocks of those asked for, and the rest are asked for next
  for (let newest = to; newest >= from; ) {
    const count = Math.min(MAX_BLOCKS_PER_CALL, newest - from + 1)
    const history = await rpc.getFeeHistory(count, newest, percentiles)
    const rows = history.reward ?? []
    if (
      rows.length === 0 ||
      rows.length > count ||
      history.oldestBlock !== newest - rows.length + 1 ||
      rows.some((row) => row.length !== percentiles.length)
    ) {
      throw new Error('Fee history malformed', {
        cause: { newest, count, oldestBlock: history.oldestBlock },
      })
    }
    tips.unshift(...rows.map((row) => row.map((wei) => Number(wei) / 1e9)))
    newest -= rows.length
  }
  return tips
}
