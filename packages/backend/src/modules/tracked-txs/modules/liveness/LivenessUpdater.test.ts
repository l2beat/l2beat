import { Logger } from '@l2beat/backend-tools'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { Knex } from 'knex'

import { TrackedTxResult } from '../../types/model'
import { TrackedTxId } from '../../types/TrackedTxId'
import { TrackedTxConfigEntry } from '../../types/TrackedTxsConfig'
import { LivenessUpdater } from './LivenessUpdater'
import {
  LivenessRecord,
  LivenessRepository,
} from './repositories/LivenessRepository'

const MIN_TIMESTAMP = UnixTime.fromDate(new Date('2023-05-01T00:00:00Z'))
const TRX = mockObject<Knex.Transaction>({})

describe(LivenessUpdater.name, () => {
  describe(LivenessUpdater.prototype.update.name, () => {
    it('skips update if no transactions', async () => {
      const logger = mockObject<Logger>({
        debug: () => undefined,
      })
      const livenessRepo = getMockLivenessRepository()
      const updater = new LivenessUpdater(livenessRepo, logger)

      const transactions: TrackedTxResult[] = []

      await updater.update(transactions, TRX)

      expect(logger.debug).toHaveBeenCalled()
      expect(livenessRepo.addMany).not.toHaveBeenCalled()
    })

    it('calls liveness repo with correct parameters', async () => {
      const livenessRepo = getMockLivenessRepository()
      const updater = new LivenessUpdater(livenessRepo, Logger.SILENT)

      const transactions: TrackedTxResult[] = getMockTrackedTxResults()
      await updater.update(transactions, TRX)

      expect(livenessRepo.addMany).toHaveBeenNthCalledWith(
        1,
        [
          {
            txHash: transactions[0].hash,
            blockNumber: transactions[0].blockNumber,
            timestamp: transactions[0].blockTimestamp,
            trackedTxId: transactions[0].use.id,
          },
          {
            txHash: transactions[1].hash,
            blockNumber: transactions[1].blockNumber,
            timestamp: transactions[1].blockTimestamp,
            trackedTxId: transactions[1].use.id,
          },
        ],
        TRX,
      )
    })
  })

  describe(LivenessUpdater.prototype.deleteAfter.name, () => {
    it('calls liveness repo with correct parameters', async () => {
      const livenessRepo = getMockLivenessRepository()
      const updater = new LivenessUpdater(livenessRepo, Logger.SILENT)

      const id = TrackedTxId.random()
      await updater.deleteAfter(id, MIN_TIMESTAMP, TRX)

      expect(livenessRepo.deleteAfter).toHaveBeenNthCalledWith(
        1,
        id,
        MIN_TIMESTAMP,
        TRX,
      )
    })
  })

  describe(LivenessUpdater.prototype.transformTransactions.name, () => {
    it('it correctly transforms records to livenessRow', () => {
      const updater = new LivenessUpdater(
        getMockLivenessRepository(),
        Logger.SILENT,
      )

      const transactions: TrackedTxResult[] = getMockTrackedTxResults()

      const expected: LivenessRecord[] = [
        {
          txHash: transactions[0].hash,
          blockNumber: transactions[0].blockNumber,
          timestamp: transactions[0].blockTimestamp,
          trackedTxId: transactions[0].use.id,
        },
        {
          txHash: transactions[1].hash,
          blockNumber: transactions[1].blockNumber,
          timestamp: transactions[1].blockTimestamp,
          trackedTxId: transactions[1].use.id,
        },
      ]

      expect(updater.transformTransactions(transactions)).toEqual(expected)
    })
  })
})

function getMockLivenessRepository() {
  return mockObject<LivenessRepository>({
    deleteAfter: async () => 0,
    runInTransaction: async (fn) => fn(TRX),
    addMany: async () => 0,
  })
}

function getMockTrackedTxResults(): TrackedTxResult[] {
  return [
    {
      type: 'functionCall',
      projectId: ProjectId('test'),
      blockNumber: 1,
      blockTimestamp: UnixTime.now(),
      toAddress: EthereumAddress.random(),
      input: '',
      hash: '',
      use: {
        type: 'liveness',
        subtype: 'batchSubmissions',
        id: getMockRuntimeConfigurations()[0].uses[0].id,
      },
    },
    {
      type: 'transfer',
      use: {
        id: getMockRuntimeConfigurations()[1].uses[0].id,
        type: 'liveness',
        subtype: 'stateUpdates',
      },
      blockNumber: 1,
      blockTimestamp: UnixTime.now(),
      hash: '',
      fromAddress: EthereumAddress.random(),
      toAddress: EthereumAddress.random(),
      projectId: ProjectId('test2'),
    },
  ]
}

function getMockRuntimeConfigurations(): TrackedTxConfigEntry[] {
  return [
    {
      formula: 'functionCall',
      projectId: ProjectId('test'),
      address: EthereumAddress.random(),
      selector: '0x',
      sinceTimestampInclusive: MIN_TIMESTAMP,
      uses: [
        {
          type: 'liveness',
          subtype: 'batchSubmissions',
          id: TrackedTxId.random(),
        },
      ],
    },
    {
      formula: 'functionCall',
      projectId: ProjectId('test2'),
      address: EthereumAddress.random(),
      selector: '0x',
      sinceTimestampInclusive: MIN_TIMESTAMP,
      uses: [
        {
          type: 'liveness',
          subtype: 'stateUpdates',
          id: TrackedTxId.random(),
        },
      ],
    },
  ]
}
