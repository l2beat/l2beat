import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { FetchText } from '../fetchText'
import { WalletTipsLoop } from './WalletTipsLoop'

describe(WalletTipsLoop.name, () => {
  it('stores the good reads and deletes those over 30 minutes old', async () => {
    const { loop, walletTips, fetchText } = createLoop(true)
    fetchText.resolvesTo({ status: 503, text: '' })

    await loop.run()

    const stored = walletTips.upsertMany.calls[0]?.args[0] ?? []
    expect(stored.map((t) => t.wallet)).toEqual(['Ambire', 'Ambire', 'Ambire'])
    const cutoff = walletTips.deleteReadBefore.calls[0]?.args[0] ?? 0
    // The loop reads the clock itself, a moment before this line does
    expect(UnixTime.now() - cutoff).toBeGreaterThanOrEqual(30 * 60)
    expect(UnixTime.now() - cutoff).toBeLessThanOrEqual(30 * 60 + 1)
  })

  it('asks a fee service that answered 429 again only after 30 minutes', async () => {
    const { loop, fetchText } = createLoop(true)
    fetchText.resolvesTo({ status: 429, text: '' })

    await loop.run()
    await loop.run()

    expect(fetchText).toHaveBeenCalledTimes(2)
  })

  it('polls no fee service when they are switched off', async () => {
    const { loop, fetchText } = createLoop(false)

    await loop.run()

    expect(fetchText).not.toHaveBeenCalled()
  })
})

function createLoop(walletServices: boolean) {
  const walletTips = mockObject<Database['gasFeesWalletTip']>({
    upsertMany: mockFn().resolvesTo(0),
    deleteReadBefore: mockFn().resolvesTo(0),
  })
  const fetchText = mockFn<FetchText>().resolvesTo({ status: 200, text: '{}' })
  const rpc = {
    getLatestBlockNumber: mockFn().resolvesTo(100),
    getFeeHistory: mockFn().resolvesTo({
      oldestBlock: 98,
      baseFeePerGas: [],
      gasUsedRatio: [],
      baseFeePerBlobGas: [],
      blobGasUsedRatio: [],
      reward: [
        [1n, 2n, 3n],
        [1n, 2n, 3n],
        [1n, 2n, 3n],
      ],
    }),
    getMaxPriorityFeePerGas: mockFn().resolvesTo(1n),
  }
  const loop = new WalletTipsLoop(
    {
      db: mockDatabase({ gasFeesWalletTip: walletTips }),
      rpc,
      walletServices,
      fetchText,
    },
    Logger.SILENT,
  )
  return { loop, walletTips, fetchText }
}
