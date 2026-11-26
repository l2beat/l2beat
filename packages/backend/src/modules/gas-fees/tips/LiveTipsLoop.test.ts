import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { EVMFeeHistory } from '@l2beat/shared'
import { Bytes } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import { LiveTipsLoop } from './LiveTipsLoop'

describe(LiveTipsLoop.name, () => {
  it('reads the history once, then the newest blocks for each new head', async () => {
    const { loop, rpc, liveTips } = createLoop()

    rpc.getLatestBlockNumber.resolvesTo(10_000)
    await loop.run()
    rpc.getLatestBlockNumber.resolvesTo(10_001)
    await loop.run()
    await loop.run()

    const newest = rpc.getFeeHistory.calls.map((c) => c.args.slice(0, 2))
    expect(newest).toEqual([
      // 1,800 blocks, the first run
      [1024, 10_000],
      [776, 8_976],
      // Then the newest 64, read again for reorgs
      [64, 10_001],
    ])
    expect(liveTips.replace).toHaveBeenCalledTimes(2)
    expect(liveTips.replace.calls[1]?.args[0]).toEqual({
      blockNumber: 10_001,
      slowTipGwei: 1e-9,
      mediumTipGwei: 1e-9,
      fastTipGwei: 1e-9,
      ethUsd: 4000,
      updatedAt: expect.a(Number),
    })
  })
})

function createLoop() {
  const liveTips = mockObject<Database['gasFeesLiveTips']>({
    replace: mockFn().resolvesTo(undefined),
  })
  const rpc = {
    getLatestBlockNumber: mockFn<() => Promise<number>>(),
    getFeeHistory: mockFn(
      async (count: number, newest: number): Promise<EVMFeeHistory> => ({
        oldestBlock: newest - count + 1,
        baseFeePerGas: [],
        gasUsedRatio: [],
        baseFeePerBlobGas: [],
        blobGasUsedRatio: [],
        reward: Array.from({ length: count }, () => [1n, 1n]),
      }),
    ),
    // 4,000 USD with Chainlink's 8 decimals
    call: mockFn().resolvesTo(
      Bytes.fromHex((4000n * 10n ** 8n).toString(16).padStart(64, '0')),
    ),
  }
  const loop = new LiveTipsLoop(
    { db: mockDatabase({ gasFeesLiveTips: liveTips }), rpc, intervalMs: 1 },
    Logger.SILENT,
  )
  return { loop, rpc, liveTips }
}
