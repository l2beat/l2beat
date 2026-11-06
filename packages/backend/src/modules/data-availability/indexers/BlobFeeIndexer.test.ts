import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { EthereumBlockFee, EthereumDaProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { BlobFeeIndexer } from './BlobFeeIndexer'

const HOUR = UnixTime.HOUR
const T0 = UnixTime.toStartOf(UnixTime(1_700_000_000), 'hour')

describe(BlobFeeIndexer.name, () => {
  beforeEach(() => _TEST_ONLY_resetUniqueIds())

  describe(BlobFeeIndexer.prototype.update.name, () => {
    it('stores a batch of fees and recomputes the hours from its first block', async () => {
      const fees = [fee(100, T0 + HOUR + 12), fee(101, T0 + HOUR + 24)]
      const { indexer, provider, blobFee, blobFeeHourly } = mockIndexer({
        fees,
        batchSize: 1000,
      })

      const safeHeight = await indexer.update(100, 101)

      expect(provider.getBlobFees).toHaveBeenOnlyCalledWith(100, 101)
      expect(blobFee.upsertMany).toHaveBeenOnlyCalledWith(fees)
      expect(blobFeeHourly.recomputeFrom).toHaveBeenOnlyCalledWith(T0 + HOUR)
      expect(safeHeight).toEqual(101)
    })

    it('fetches no more than a batch of blocks', async () => {
      const { indexer, provider } = mockIndexer({
        fees: [fee(100, T0)],
        batchSize: 10,
      })

      const safeHeight = await indexer.update(100, 200)

      expect(provider.getBlobFees).toHaveBeenOnlyCalledWith(100, 109)
      expect(safeHeight).toEqual(109)
    })
  })

  describe(BlobFeeIndexer.prototype.invalidate.name, () => {
    it('drops the blocks above the height and recomputes from the hour of the newest kept', async () => {
      const { indexer, blobFee, blobFeeHourly } = mockIndexer({
        stored: fee(100, T0 + HOUR + 12),
      })

      const safeHeight = await indexer.invalidate(100)

      expect(blobFee.deleteAfter).toHaveBeenOnlyCalledWith(100)
      expect(blobFeeHourly.recomputeFrom).toHaveBeenOnlyCalledWith(T0 + HOUR)
      expect(safeHeight).toEqual(100)
    })

    it('recomputes everything when no block is kept', async () => {
      const { indexer, blobFeeHourly } = mockIndexer({})

      await indexer.invalidate(99)

      expect(blobFeeHourly.recomputeFrom).toHaveBeenOnlyCalledWith(0)
    })
  })
})

function mockIndexer($: {
  fees?: EthereumBlockFee[]
  stored?: EthereumBlockFee
  batchSize?: number
}) {
  const provider = mockObject<EthereumDaProvider>({
    getBlobFees: mockFn().resolvesTo($.fees ?? []),
  })
  const blobFee = mockObject<Database['blobFee']>({
    upsertMany: mockFn().resolvesTo(0),
    deleteAfter: mockFn().resolvesTo(0),
    findByBlockNumber: mockFn().resolvesTo($.stored),
  })
  const blobFeeHourly = mockObject<Database['blobFeeHourly']>({
    recomputeFrom: mockFn().resolvesTo(undefined),
  })
  const indexer = new BlobFeeIndexer(
    {
      db: mockDatabase({ blobFee, blobFeeHourly }),
      provider,
      batchSize: $.batchSize ?? 100,
      indexerService: mockObject<IndexerService>({}),
      minHeight: 0,
      parents: [],
    },
    Logger.SILENT,
  )
  return { indexer, provider, blobFee, blobFeeHourly }
}

function fee(blockNumber: number, timestamp: number): EthereumBlockFee {
  return {
    blockNumber,
    timestamp: UnixTime(timestamp),
    blobBaseFee: BigInt(blockNumber),
    baseFeePerGas: BigInt(blockNumber) * 16n,
  }
}
