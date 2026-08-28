import { Logger } from '@l2beat/backend-tools'
import type { Database, L2CostRecord } from '@l2beat/database'
import { createTrackedTxId, type TrackedTxConfigEntry } from '@l2beat/shared'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { TrackedTxResult } from '../../types/model'
import { ONE_BLOB_GAS } from '../../utils/const'
import type { BlobPriceProvider } from './BlobPriceProvider'
import { L2CostsUpdater } from './L2CostsUpdater'

const MIN_TIMESTAMP = UnixTime.now()

describe(L2CostsUpdater.name, () => {
  describe(L2CostsUpdater.prototype.update.name, () => {
    it('skips if no transactions', async () => {
      const repository = getMockL2CostsRepository()
      const blobPriceProvider = getMockBlobPriceProvider()
      const updater = new L2CostsUpdater(
        mockObject<Database>({ l2Cost: repository }),
        Logger.SILENT,
        blobPriceProvider,
      )

      await updater.update([])

      expect(repository.insertMany).not.toHaveBeenCalled()
      expect(blobPriceProvider.getBlobPricesByBlockRange).not.toHaveBeenCalled()
    })

    it('transforms and saves to db', async () => {
      const repository = getMockL2CostsRepository()
      const transactions = getMockTrackedTxResults()
      const blobPricesByBlock = new Map<number, bigint>([[2, 10n]])
      const blobPriceProvider = getMockBlobPriceProvider(blobPricesByBlock)
      const updater = new L2CostsUpdater(
        mockObject<Database>({ l2Cost: repository }),
        Logger.SILENT,
        blobPriceProvider,
      )

      await updater.update(transactions)

      expect(blobPriceProvider.getBlobPricesByBlockRange).toHaveBeenCalledWith([
        1, 2,
      ])
      expect(repository.insertMany).toHaveBeenCalledTimes(1)
      const insertedRecords = repository.insertMany.calls[0]?.args[0] as
        | L2CostRecord[]
        | undefined
      expect(insertedRecords).not.toEqual(undefined)
      expect(insertedRecords?.length).toEqual(2)
    })

    it('handles transactions across multiple blocks', async () => {
      const repository = getMockL2CostsRepository()
      const transactions: TrackedTxResult[] = [
        {
          ...getMockTrackedTxResults()[0],
          blockNumber: 100,
        },
        {
          ...getMockTrackedTxResults()[1],
          blockNumber: 200,
        },
      ]
      const blobPricesByBlock = new Map<number, bigint>([
        [100, 10n],
        [200, 20n],
      ])
      const blobPriceProvider = getMockBlobPriceProvider(blobPricesByBlock)
      const updater = new L2CostsUpdater(
        mockObject<Database>({ l2Cost: repository }),
        Logger.SILENT,
        blobPriceProvider,
      )

      await updater.update(transactions)

      expect(blobPriceProvider.getBlobPricesByBlockRange).toHaveBeenCalledWith([
        100, 200,
      ])
      expect(repository.insertMany).toHaveBeenCalledTimes(1)
    })

    it('throws error when blob price is missing for transaction with blob hashes', async () => {
      const repository = getMockL2CostsRepository()
      const transactions = getMockTrackedTxResults()
      // Transaction at block 1 has blobVersionedHashes but no price provided
      const blobPricesByBlock = new Map<number, bigint>()
      const blobPriceProvider = getMockBlobPriceProvider(blobPricesByBlock)
      const updater = new L2CostsUpdater(
        mockObject<Database>({ l2Cost: repository }),
        Logger.SILENT,
        blobPriceProvider,
      )

      await expect(updater.update(transactions)).toBeRejectedWith(
        'Blob base fee not found for block 2',
      )
    })
  })

  describe(L2CostsUpdater.prototype.transform.name, () => {
    it('transforms transactions and adds details', () => {
      const repository = getMockL2CostsRepository()
      const blobPriceProvider = getMockBlobPriceProvider()
      const updater = new L2CostsUpdater(
        mockObject<Database>({ l2Cost: repository }),
        Logger.SILENT,
        blobPriceProvider,
      )

      const transactions = getMockTrackedTxResults()
      const blobBaseFeeByBlock = new Map<number, bigint>([[2, 10n]])

      const result = updater.transform(transactions, blobBaseFeeByBlock)

      const expected: L2CostRecord[] = [
        {
          txHash: transactions[0].hash,
          timestamp: transactions[0].blockTimestamp,
          configurationId: transactions[0].id,
          gasUsed: transactions[0].gasUsed,
          gasPrice: transactions[0].gasPrice,
          //  input: 0x00aa00bbff
          calldataLength: 5,
          calldataGasUsed: 4 * 2 + 3 * 16,
          blobGasPrice: null,
          blobGasUsed: null,
        },
        {
          txHash: transactions[1].hash,
          timestamp: transactions[1].blockTimestamp,
          configurationId: transactions[1].id,
          gasUsed: transactions[1].gasUsed,
          gasPrice: transactions[1].gasPrice,
          //  input: 0x
          calldataLength: 0,
          calldataGasUsed: 0,
          blobGasPrice: 10n,
          blobGasUsed: ONE_BLOB_GAS,
        },
      ]

      expect(result).toEqualUnsorted(expected)
    })

    it('throws error when blob price is missing for transaction with blob hashes', () => {
      const repository = getMockL2CostsRepository()
      const blobPriceProvider = getMockBlobPriceProvider()
      const updater = new L2CostsUpdater(
        mockObject<Database>({ l2Cost: repository }),
        Logger.SILENT,
        blobPriceProvider,
      )

      const transactions = getMockTrackedTxResults()
      const blobBaseFeeByBlock = new Map<number, bigint>()

      expect(() => updater.transform(transactions, blobBaseFeeByBlock)).toThrow(
        'Blob base fee not found for block 2',
      )
    })

    it('handles multiple blob hashes correctly', () => {
      const repository = getMockL2CostsRepository()
      const blobPriceProvider = getMockBlobPriceProvider()
      const updater = new L2CostsUpdater(
        mockObject<Database>({ l2Cost: repository }),
        Logger.SILENT,
        blobPriceProvider,
      )

      const transactions: TrackedTxResult[] = [
        {
          ...getMockTrackedTxResults()[1],
          blobVersionedHashes: ['0x1', '0x2', '0x3'],
        },
      ]
      const blobBaseFeeByBlock = new Map<number, bigint>([[2, 10n]])

      const result = updater.transform(transactions, blobBaseFeeByBlock)

      expect(result[0].blobGasUsed).toEqual(3 * ONE_BLOB_GAS)
      expect(result[0].blobGasPrice).toEqual(10n)
    })

    it('handles null blob price when transaction has no blob hashes', () => {
      const repository = getMockL2CostsRepository()
      const blobPriceProvider = getMockBlobPriceProvider()
      const updater = new L2CostsUpdater(
        mockObject<Database>({ l2Cost: repository }),
        Logger.SILENT,
        blobPriceProvider,
      )

      const transactions = [getMockTrackedTxResults()[0]]
      const blobBaseFeeByBlock = new Map<number, bigint>()

      const result = updater.transform(transactions, blobBaseFeeByBlock)

      expect(result[0].blobGasPrice).toEqual(null)
      expect(result[0].blobGasUsed).toEqual(null)
    })
  })

  describe(L2CostsUpdater.prototype.deleteFromById.name, () => {
    it('calls repository deleteAfter', async () => {
      const repository = getMockL2CostsRepository()
      const blobPriceProvider = getMockBlobPriceProvider()
      const updater = new L2CostsUpdater(
        mockObject<Database>({ l2Cost: repository }),
        Logger.SILENT,
        blobPriceProvider,
      )

      const id = createTrackedTxId.random()
      await updater.deleteFromById(id, MIN_TIMESTAMP)

      expect(repository.deleteFromById).toHaveBeenNthCalledWith(
        1,
        id,
        MIN_TIMESTAMP,
      )
    })
  })
})

function getMockBlobPriceProvider(
  blobPricesByBlockRange?: Map<number, bigint>,
) {
  return mockObject<BlobPriceProvider>({
    getBlobPricesByBlockRange: mockFn().resolvesTo(
      blobPricesByBlockRange ?? new Map(),
    ),
  })
}

function getMockL2CostsRepository() {
  return mockObject<Database['l2Cost']>({
    deleteFromById: async () => 0,
    insertMany: async () => 0,
  })
}

function getMockRuntimeConfigurations(): TrackedTxConfigEntry[] {
  return [
    {
      params: {
        formula: 'functionCall',
        address: EthereumAddress.random(),
        selector: '0x',
        signature: 'function foo()',
      },
      projectId: ProjectId('test'),
      sinceTimestamp: MIN_TIMESTAMP,
      type: 'liveness',
      id: createTrackedTxId.random(),
      subtype: 'batchSubmissions',
    },
    {
      params: {
        formula: 'functionCall',
        address: EthereumAddress.random(),
        selector: '0x',
        signature: 'function foo()',
      },
      projectId: ProjectId('test2'),
      sinceTimestamp: MIN_TIMESTAMP,
      type: 'liveness',
      subtype: 'stateUpdates',
      id: createTrackedTxId.random(),
    },
  ]
}

function getMockTrackedTxResults(): TrackedTxResult[] {
  return [
    {
      formula: 'functionCall',
      projectId: ProjectId('test'),
      blockNumber: 1,
      blockTimestamp: UnixTime.now(),
      toAddress: EthereumAddress.random(),
      input: '',
      hash: '',
      type: 'liveness',
      subtype: 'batchSubmissions',
      id: getMockRuntimeConfigurations()[0].id,
      gasUsed: 100,
      gasPrice: 10n,
      dataLength: 5,
      calldataGasUsed: 56,
      blobVersionedHashes: null,
    },
    {
      formula: 'transfer',
      id: getMockRuntimeConfigurations()[1].id,
      type: 'liveness',
      subtype: 'stateUpdates',
      blockNumber: 2,
      blockTimestamp: UnixTime.now(),
      hash: '',
      fromAddress: EthereumAddress.random(),
      toAddress: EthereumAddress.random(),
      projectId: ProjectId('test2'),
      gasUsed: 200,
      gasPrice: 20n,
      dataLength: 0,
      calldataGasUsed: 0,
      blobVersionedHashes: ['0x2'],
    },
  ]
}
