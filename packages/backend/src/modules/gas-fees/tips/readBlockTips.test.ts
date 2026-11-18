import type { EVMFeeHistory } from '@l2beat/shared'
import { expect, mockFn } from 'earl'
import { readBlockTips } from './readBlockTips'

describe(readBlockTips.name, () => {
  it('reads 1,024 blocks a call, oldest first, in gwei', async () => {
    const getFeeHistory = mockFn(
      async (
        count: number,
        newest: number,
        _percentiles: number[],
      ): Promise<EVMFeeHistory> => history(newest - count + 1, count),
    )

    const tips = await readBlockTips({ getFeeHistory }, 1, 2000, [10, 25])

    expect(getFeeHistory.calls.map((c) => c.args)).toEqual([
      [1024, 2000, [10, 25]],
      [976, 976, [10, 25]],
    ])
    expect(tips).toHaveLength(2000)
    expect(tips[0]).toEqual([1e-9, 2e-9])
    expect(tips[1999]).toEqual([2000e-9, 4000e-9])
  })

  it('fails when the node returns other blocks than asked', async () => {
    const getFeeHistory = mockFn().resolvesTo(history(5, 10))

    await expect(
      readBlockTips({ getFeeHistory }, 1, 10, [10, 25]),
    ).toBeRejectedWith('Fee history malformed')
  })

  it('fails on a block without a tip at every percentile', async () => {
    const getFeeHistory = mockFn().resolvesTo(history(1, 10))

    await expect(
      readBlockTips({ getFeeHistory }, 1, 10, [10, 25, 50]),
    ).toBeRejectedWith('Fee history malformed')
  })
})

/** Block n tips n wei at the 10th percentile and 2n at the 25th */
function history(oldestBlock: number, count: number): EVMFeeHistory {
  return {
    oldestBlock,
    baseFeePerGas: [],
    gasUsedRatio: [],
    baseFeePerBlobGas: [],
    blobGasUsedRatio: [],
    reward: Array.from({ length: count }, (_, i) => [
      BigInt(oldestBlock + i),
      BigInt(2 * (oldestBlock + i)),
    ]),
  }
}
