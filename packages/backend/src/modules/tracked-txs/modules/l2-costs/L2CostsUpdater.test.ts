import { Logger } from '@l2beat/backend-tools'
import type { Database, L2CostRecord } from '@l2beat/database'
import { createTrackedTxId, type TrackedTxConfigEntry } from '@l2beat/shared'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { TrackedTxResult } from '../../types/model'
import { L2CostsUpdater } from './L2CostsUpdater'

const MIN_TIMESTAMP = UnixTime.now()

describe(L2CostsUpdater.name, () => {
  describe(L2CostsUpdater.prototype.update.name, () => {
    it('skips if no transactions', async () => {
      const repository = getMockL2CostsRepository()
      const updater = new L2CostsUpdater(
        mockObject<Database>({ l2Cost: repository }),
        Logger.SILENT,
      )

      await updater.update([])

      expect(repository.insertMany).not.toHaveBeenCalled()
    })

    it('transforms and saves to db ', async () => {
      const repository = getMockL2CostsRepository()
      const updater = new L2CostsUpdater(
        mockObject<Database>({ l2Cost: repository }),
        Logger.SILENT,
      )
      const transactions = getMockTrackedTxResults()

      const mockRecord: L2CostRecord[] = [
        mockObject<L2CostRecord>({
          txHash: '0x123',
        }),
      ]

      updater.transform = mockFn().returns(mockRecord)

      await updater.update(transactions)

      expect(repository.insertMany).toHaveBeenNthCalledWith(1, mockRecord)
    })
  })

  describe(L2CostsUpdater.prototype.transform.name, () => {
    it('transforms transactions and adds details', async () => {
      const repository = getMockL2CostsRepository()
      const updater = new L2CostsUpdater(
        mockObject<Database>({ l2Cost: repository }),
        Logger.SILENT,
      )

      const transactions = getMockTrackedTxResults()

      const result = updater.transform(transactions)

      const expected: L2CostRecord[] = [
        {
          txHash: transactions[0].hash,
          timestamp: transactions[0].blockTimestamp,
          configurationId: transactions[0].id,
          gasUsed: transactions[0].receiptGasUsed,
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
          gasUsed: transactions[1].receiptGasUsed,
          gasPrice: transactions[1].gasPrice,
          //  input: 0x
          calldataLength: 0,
          calldataGasUsed: 0,
          blobGasPrice: 10n,
          blobGasUsed: 100,
        },
      ]

      expect(result).toEqualUnsorted(expected)
    })
  })

  describe(L2CostsUpdater.prototype.deleteFromById.name, () => {
    it('calls repository deleteAfter', async () => {
      const repository = getMockL2CostsRepository()
      const updater = new L2CostsUpdater(
        mockObject<Database>({ l2Cost: repository }),
        Logger.SILENT,
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
      receiptGasUsed: 100,
      gasPrice: 10n,
      dataLength: 5,
      calldataGasUsed: 56,
      receiptBlobGasPrice: null,
      receiptBlobGasUsed: null,
    },
    {
      formula: 'transfer',
      id: getMockRuntimeConfigurations()[1].id,
      type: 'liveness',
      subtype: 'stateUpdates',
      blockNumber: 1,
      blockTimestamp: UnixTime.now(),
      hash: '',
      fromAddress: EthereumAddress.random(),
      toAddress: EthereumAddress.random(),
      projectId: ProjectId('test2'),
      receiptGasUsed: 200,
      gasPrice: 20n,
      dataLength: 0,
      calldataGasUsed: 0,
      receiptBlobGasPrice: 10n,
      receiptBlobGasUsed: 100,
    },
  ]
}
