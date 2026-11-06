import { Logger } from '@l2beat/backend-tools'
import type { IRpcClient } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { BlockTxsCountService } from '../services/txs/BlockTxsCountService'
import type { ActivityBlockProvider } from '../services/txs/types'
import type { UopsAnalyzer } from '../services/uops/types'
import { RpcBlockFetcher } from './RpcBlockFetcher'

const T0 = UnixTime.fromDate(new Date('2026-11-06T12:00:00Z'))

describe(RpcBlockFetcher.name, () => {
  describe(RpcBlockFetcher.prototype.getBlocks.name, () => {
    it('counts blocks as the activity indexer does, with hashes and gas', async () => {
      const rpc = mockObject<IRpcClient>({
        getBlockWithTransactions: mockFn(async (number: number | 'latest') =>
          rpcBlock(number as number),
        ),
      })
      const uopsAnalyzer = mockObject<UopsAnalyzer>({
        calculateUops: () => 4,
      })
      // An OP stack chain, whose every block starts with a deposit
      const fetcher = new RpcBlockFetcher(
        rpc,
        uopsAnalyzer,
        counter((count) => count - 1),
      )

      const blocks = await fetcher.getBlocks(10, 11)

      expect(blocks).toEqual([
        {
          number: 10,
          timestamp: T0 + 10,
          txsCount: 2,
          uopsCount: 3,
          hash: '0x10',
          parentHash: '0x9',
          gasUsed: 30_000_000,
        },
        {
          number: 11,
          timestamp: T0 + 11,
          txsCount: 2,
          uopsCount: 3,
          hash: '0x11',
          parentHash: '0x10',
          gasUsed: 30_000_000,
        },
      ])
    })

    it('rejects a block other than the one asked for', async () => {
      const rpc = mockObject<IRpcClient>({
        getBlockWithTransactions: async () => rpcBlock(12),
      })
      const fetcher = new RpcBlockFetcher(
        rpc,
        undefined,
        counter((count) => count),
      )

      await expect(fetcher.getBlocks(10, 10)).toBeRejectedWith(
        'expected block number 10, got 12',
      )
    })
  })

  describe(RpcBlockFetcher.prototype.getBlockHash.name, () => {
    it("reads the hash from the block's header", async () => {
      const rpc = mockObject<IRpcClient>({
        chain: 'optimism',
        getBlock: mockFn().resolvesTo({ ...rpcBlock(10), hash: '0xabc' }),
      })
      const fetcher = new RpcBlockFetcher(
        rpc,
        undefined,
        counter((count) => count),
      )

      expect(await fetcher.getBlockHash(10)).toEqual('0xabc')
      // getBlock is overloaded, and the mock takes only its last signature
      expect(rpc.getBlock.calls.map((c) => c.args as unknown[])).toEqual([
        [10, false],
      ])
    })
  })
})

function counter(assessCount: (count: number) => number) {
  return new BlockTxsCountService(
    {
      provider: mockObject<ActivityBlockProvider>(),
      projectId: ProjectId('optimism'),
      assessCount,
    },
    Logger.SILENT,
  )
}

function rpcBlock(number: number) {
  return {
    number,
    hash: `0x${number}`,
    parentHash: `0x${number - 1}`,
    timestamp: T0 + number,
    logsBloom: '0x',
    gasUsed: 30_000_000,
    transactions: [tx(), tx(), tx()],
  }
}

function tx() {
  return {
    hash: '0x1',
    value: 0n,
    from: '0xf',
    to: '0x2',
    data: '0x',
    blockNumber: 0,
    type: '2',
    calls: undefined,
    blobVersionedHashes: undefined,
  }
}
