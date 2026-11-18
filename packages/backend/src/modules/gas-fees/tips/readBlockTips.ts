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
  const calls: { newest: number; count: number }[] = []
  for (let newest = to; newest >= from; newest -= MAX_BLOCKS_PER_CALL) {
    calls.push({
      newest,
      count: Math.min(MAX_BLOCKS_PER_CALL, newest - from + 1),
    })
  }
  const histories = await Promise.all(
    calls.map(({ newest, count }) =>
      rpc.getFeeHistory(count, newest, percentiles),
    ),
  )
  const tips: number[][] = []
  for (const [i, history] of histories.entries()) {
    const call = calls[i]
    if (
      !call ||
      history.oldestBlock !== call.newest - call.count + 1 ||
      history.reward?.length !== call.count ||
      history.reward.some((row) => row.length !== percentiles.length)
    ) {
      throw new Error('Fee history malformed', {
        cause: { call, oldestBlock: history.oldestBlock },
      })
    }
    tips.unshift(
      ...history.reward.map((row) => row.map((wei) => Number(wei) / 1e9)),
    )
  }
  return tips
}
