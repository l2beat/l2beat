import { Logger } from '@l2beat/backend-tools'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { Database, LivenessRecord } from '@l2beat/database'
import { TrackedTxConfigEntry, createTrackedTxId } from '@l2beat/shared'
import { MOCK_TRX, mockDatabase } from '../../../../test/database'
import { TrackedTxResult } from '../../types/model'
import { LivenessUpdater } from './LivenessUpdater'

const MIN_TIMESTAMP = UnixTime.fromDate(new Date('2023-05-01T00:00:00Z'))

describe(LivenessUpdater.name, () => {
  describe(LivenessUpdater.prototype.update.name, () => {
    it('skips update if no transactions', async () => {
      const livenessRepo = getMockLivenessRepository()
      const updater = new LivenessUpdater(
        mockDatabase({ liveness: livenessRepo }),
        Logger.SILENT,
      )

      const transactions: TrackedTxResult[] = []

      await updater.update(transactions, MOCK_TRX)

      expect(livenessRepo.addMany).not.toHaveBeenCalled()
    })

    it('calls liveness repo with correct parameters', async () => {
      const livenessRepo = getMockLivenessRepository()
      const updater = new LivenessUpdater(
        mockDatabase({ liveness: livenessRepo }),
        Logger.SILENT,
      )

      const transactions: TrackedTxResult[] = getMockTrackedTxResults()
      await updater.update(transactions, MOCK_TRX)

      expect(livenessRepo.addMany).toHaveBeenNthCalledWith(
        1,
        [
          {
            txHash: transactions[0].hash,
            blockNumber: transactions[0].blockNumber,
            timestamp: transactions[0].blockTimestamp,
            configurationId: transactions[0].id,
          },
          {
            txHash: transactions[1].hash,
            blockNumber: transactions[1].blockNumber,
            timestamp: transactions[1].blockTimestamp,
            configurationId: transactions[1].id,
          },
        ],
        MOCK_TRX,
      )
    })
  })

  describe(LivenessUpdater.prototype.deleteFromById.name, () => {
    it('calls liveness repo with correct parameters', async () => {
      const livenessRepo = getMockLivenessRepository()
      const updater = new LivenessUpdater(
        mockDatabase({ liveness: livenessRepo }),
        Logger.SILENT,
      )

      const id = createTrackedTxId.random()
      await updater.deleteFromById(id, MIN_TIMESTAMP, MOCK_TRX)

      expect(livenessRepo.deleteFromById).toHaveBeenNthCalledWith(
        1,
        id,
        MIN_TIMESTAMP,
        MOCK_TRX,
      )
    })
  })

  describe(LivenessUpdater.prototype.transformTransactions.name, () => {
    it('it correctly transforms records to livenessRow', () => {
      const updater = new LivenessUpdater(
        mockDatabase({ liveness: getMockLivenessRepository() }),
        Logger.SILENT,
      )

      const transactions: TrackedTxResult[] = getMockTrackedTxResults()

      const expected: LivenessRecord[] = [
        {
          txHash: transactions[0].hash,
          blockNumber: transactions[0].blockNumber,
          timestamp: transactions[0].blockTimestamp,
          configurationId: transactions[0].id,
        },
        {
          txHash: transactions[1].hash,
          blockNumber: transactions[1].blockNumber,
          timestamp: transactions[1].blockTimestamp,
          configurationId: transactions[1].id,
        },
      ]

      expect(updater.transformTransactions(transactions)).toEqual(expected)
    })
  })
})

function getMockLivenessRepository() {
  return mockObject<Database['liveness']>({
    deleteFromById: async () => 0,
    addMany: async () => 0,
  })
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
      calldataGasUsed: 10,
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
      receiptBlobGasPrice: null,
      receiptBlobGasUsed: null,
    },
  ]
}

function getMockRuntimeConfigurations(): TrackedTxConfigEntry[] {
  return [
    {
      params: {
        formula: 'functionCall',

        address: EthereumAddress.random(),
        selector: '0x',
      },
      projectId: ProjectId('test'),
      sinceTimestamp: MIN_TIMESTAMP,
      type: 'liveness',
      subtype: 'batchSubmissions',
      id: createTrackedTxId.random(),
    },
    {
      params: {
        formula: 'functionCall',
        address: EthereumAddress.random(),
        selector: '0x',
      },
      projectId: ProjectId('test2'),
      sinceTimestamp: MIN_TIMESTAMP,
      type: 'liveness',
      subtype: 'stateUpdates',
      id: createTrackedTxId.random(),
    },
  ]
}
