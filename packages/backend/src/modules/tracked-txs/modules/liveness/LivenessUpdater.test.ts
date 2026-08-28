import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { createTrackedTxId, type TrackedTxConfigEntry } from '@l2beat/shared'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { mockDatabase } from '../../../../test/database'
import type { TrackedTxResult } from '../../types/model'
import { LivenessUpdater } from './LivenessUpdater'

const MIN_TIMESTAMP = UnixTime.fromDate(new Date('2023-05-01T00:00:00Z'))

describe(LivenessUpdater.name, () => {
  describe(LivenessUpdater.prototype.update.name, () => {
    it('calls liveness repo with correct parameters', async () => {
      const livenessRepo = getMockLivenessRepository()
      const updater = new LivenessUpdater(
        mockDatabase({ liveness: livenessRepo }),
        Logger.SILENT,
      )

      const transactions: TrackedTxResult[] = getMockTrackedTxResults()
      await updater.update(transactions)

      expect(livenessRepo.insertMany).toHaveBeenNthCalledWith(1, [
        {
          txHash: transactions[0].hash,
          blockNumber: transactions[0].blockNumber,
          timestamp: transactions[0].blockTimestamp,
          configurationId: transactions[0].id,
          groupingKey: 'epoch-1',
        },
        {
          txHash: transactions[1].hash,
          blockNumber: transactions[1].blockNumber,
          timestamp: transactions[1].blockTimestamp,
          configurationId: transactions[1].id,
        },
      ])
    })
  })

  describe(LivenessUpdater.prototype.transformTransactions.name, () => {
    it('deduplicates by storage identity without merging different grouping keys', () => {
      const updater = new LivenessUpdater(
        mockDatabase({ liveness: getMockLivenessRepository() }),
        Logger.SILENT,
      )
      const [grouped, ungrouped] = getMockTrackedTxResults()
      if (
        grouped?.formula !== 'functionCall' ||
        grouped.type !== 'liveness' ||
        ungrouped?.formula !== 'transfer'
      ) {
        throw new Error('Invalid mock tracked transaction results')
      }
      const transactions: TrackedTxResult[] = [
        grouped,
        { ...grouped, input: 'different-input' },
        { ...grouped, input: 'another-input', groupingKey: 'epoch-2' },
        ungrouped,
        { ...ungrouped, fromAddress: EthereumAddress.random() },
      ]

      const result = updater.transformTransactions(transactions)

      expect(result).toEqual([
        {
          txHash: grouped.hash,
          blockNumber: grouped.blockNumber,
          timestamp: grouped.blockTimestamp,
          configurationId: grouped.id,
          groupingKey: 'epoch-1',
        },
        {
          txHash: grouped.hash,
          blockNumber: grouped.blockNumber,
          timestamp: grouped.blockTimestamp,
          configurationId: grouped.id,
          groupingKey: 'epoch-2',
        },
        {
          txHash: ungrouped.hash,
          blockNumber: ungrouped.blockNumber,
          timestamp: ungrouped.blockTimestamp,
          configurationId: ungrouped.id,
        },
      ])
    })
  })
})

function getMockLivenessRepository() {
  return mockObject<Database['liveness']>({
    deleteFromById: async () => 0,
    insertMany: async () => 0,
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
      groupingKey: 'epoch-1',
      gasUsed: 100,
      gasPrice: 10n,
      dataLength: 5,
      calldataGasUsed: 10,
      blobVersionedHashes: null,
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
      gasUsed: 200,
      gasPrice: 20n,
      dataLength: 0,
      calldataGasUsed: 0,
      blobVersionedHashes: null,
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
        signature: 'function foo()',
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
