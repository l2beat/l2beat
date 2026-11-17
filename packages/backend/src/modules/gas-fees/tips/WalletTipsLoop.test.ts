import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import { WalletTipsLoop } from './WalletTipsLoop'

describe(WalletTipsLoop.name, () => {
  it('stores the good reads and deletes those over 30 minutes old', async () => {
    const { loop, walletTips, fetchJson } = createLoop(true)
    fetchJson.rejectsWith(new Error('down'))

    await loop.run()

    const stored = walletTips.upsertMany.calls[0]?.args[0] ?? []
    expect(stored.map((t) => t.wallet)).toEqual(['Ambire', 'Ambire', 'Ambire'])
    const cutoff = walletTips.deleteReadBefore.calls[0]?.args[0] ?? 0
    expect(UnixTime.now() - cutoff).toEqual(30 * 60)
  })

  it('asks a fee service that answered 429 again only after 30 minutes', async () => {
    const { loop, fetchJson } = createLoop(true)
    fetchJson.rejectsWith(
      new Error('Wallet fee service error', { cause: { status: 429 } }),
    )

    await loop.run()
    await loop.run()

    expect(fetchJson).toHaveBeenCalledTimes(2)
  })

  it('polls no fee service when they are switched off', async () => {
    const { loop, fetchJson } = createLoop(false)

    await loop.run()

    expect(fetchJson).not.toHaveBeenCalled()
  })
})

function createLoop(walletServices: boolean) {
  const walletTips = mockObject<Database['gasFeesWalletTip']>({
    upsertMany: mockFn().resolvesTo(0),
    deleteReadBefore: mockFn().resolvesTo(0),
  })
  const fetchJson = mockFn<(url: string) => Promise<unknown>>().resolvesTo({})
  const rpc = {
    getLatestBlockNumber: mockFn().resolvesTo(100),
    getFeeHistory: mockFn().resolvesTo({
      oldestBlock: 98,
      baseFeePerGas: [],
      gasUsedRatio: [],
      baseFeePerBlobGas: [],
      blobGasUsedRatio: [],
      reward: [[1n, 2n, 3n]],
    }),
    getMaxPriorityFeePerGas: mockFn().resolvesTo(1n),
  }
  const loop = new WalletTipsLoop(
    {
      db: mockDatabase({ gasFeesWalletTip: walletTips }),
      rpc,
      walletServices,
      fetchJson,
    },
    Logger.SILENT,
  )
  return { loop, walletTips, fetchJson }
}
