import { Logger } from '@l2beat/backend-tools'
import type { IRpcClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { mockDatabase } from '../../test/database'
import { ChainHeads } from './ChainHeads'
import { FakeChain, FakeChainBlocks } from './test/FakeChain'

const READER = { batchSize: 100, keepFor: 4 * UnixTime.HOUR, fullBlocks: true }

describe(ChainHeads.name, () => {
  describe(ChainHeads.prototype.get.name, () => {
    it('gives every reader of a chain the same head', () => {
      const heads = chainHeads(['base', 'optimism'])

      const first = heads.get('base', READER)
      const second = heads.get('base', READER)

      expect(first).not.toEqual(undefined)
      expect(second === first).toEqual(true)
      expect(heads.get('optimism', READER) === first).toEqual(false)
    })

    it('fetches blocks in batches of the smallest size a reader asked for', async () => {
      const chain = new FakeChain(100, UnixTime.now() - 100)
      const store = new FakeChainBlocks('base', [chain.block(90)])
      const rpc = mockObject<IRpcClient>({
        chain: 'base',
        getLatestBlockNumber: async () => chain.latest,
        getBlockWithTransactions: async (number) =>
          chain.block(number as number),
      })
      const heads = new ChainHeads({
        rpcClients: [rpc],
        db: store.db,
        logger: Logger.SILENT,
      })

      const head = heads.get('base', READER)
      heads.get('base', { ...READER, batchSize: 4 })
      heads.get('base', READER)
      await head?.follow()

      expect(store.numbers()).toEqual([90, 91, 92, 93, 94])
    })

    it('has no head for a chain with no RPC to follow', () => {
      const heads = chainHeads(['base'])

      expect(heads.get('starknet', READER)).toEqual(undefined)
      expect(heads.all()).toEqual([])
    })
  })

  describe(ChainHeads.prototype.all.name, () => {
    it('lists the heads that were asked for, each once', () => {
      const heads = chainHeads(['base', 'optimism', 'arbitrum'])
      const base = heads.get('base', READER)
      const optimism = heads.get('optimism', READER)
      heads.get('base', READER)

      const all = heads.all()

      expect(all.length).toEqual(2)
      expect(all[0] === base && all[1] === optimism).toEqual(true)
    })
  })
})

function chainHeads(chains: string[]) {
  return new ChainHeads({
    rpcClients: chains.map((chain) => mockObject<IRpcClient>({ chain })),
    db: mockDatabase(),
    logger: Logger.SILENT,
  })
}
