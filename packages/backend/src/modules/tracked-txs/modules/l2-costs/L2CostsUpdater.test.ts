import { Logger } from '@l2beat/backend-tools'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { Knex } from 'knex'

import { ViemRpcClient } from '../../../../peripherals/viem-rpc-client/ViemRpcClient'
import { TrackedTxResult } from '../../types/model'
import { TrackedTxId } from '../../types/TrackedTxId'
import { TrackedTxConfigEntry } from '../../types/TrackedTxsConfig'
import { L2CostsUpdater } from './L2CostsUpdater'
import {
  L2CostsRecord,
  L2CostsRepository,
} from './repositories/L2CostsRepository'

const MIN_TIMESTAMP = UnixTime.now()

describe(L2CostsUpdater.name, () => {
  describe(
    L2CostsUpdater.prototype.addDetailsTransactionsAndTransform.name,
    () => {
      it('transforms transactions and adds details for tx type 2', async () => {
        const repository = getMockL2CostsRepository()
        const updater = new L2CostsUpdater(
          repository,
          getMockViemRpcClient(),
          Logger.SILENT,
        )

        const transactions = getMockTrackedTxResults()

        const type2Tx = transactions[0]

        const result = await updater.addDetailsTransactionsAndTransform([
          type2Tx,
        ])

        const expected: L2CostsRecord[] = [
          {
            txHash: type2Tx.hash,
            timestamp: type2Tx.blockTimestamp,
            trackedTxId: type2Tx.use.id,
            data: {
              type: 2,
              gasUsed: type2Tx.receiptGasUsed,
              gasPrice: type2Tx.gasPrice,
              //  input: 0x00aa00bbff
              calldataLength: 5,
              calldataGasUsed: 4 * 2 + 3 * 16,
            },
          },
        ]

        expect(result).toEqual(expected)
      })

      it('transforms transactions and adds details for tx type 3', async () => {
        const repository = getMockL2CostsRepository()
        const updater = new L2CostsUpdater(
          repository,
          getMockViemRpcClient(),
          Logger.SILENT,
        )

        const transactions = getMockTrackedTxResults()

        const type3Tx = transactions[1]

        const result = await updater.addDetailsTransactionsAndTransform([
          type3Tx,
        ])

        const expected: L2CostsRecord[] = [
          {
            txHash: type3Tx.hash,
            timestamp: type3Tx.blockTimestamp,
            trackedTxId: type3Tx.use.id,
            data: {
              type: 3,
              gasUsed: type3Tx.receiptGasUsed,
              gasPrice: type3Tx.gasPrice,
              //  input: 0x00aa00bbff
              calldataLength: 5,
              calldataGasUsed: 4 * 2 + 3 * 16,
              blobGasPrice: 10,
              blobGasUsed: 100,
            },
          },
        ]

        expect(result).toEqual(expected)
      })

      it('transforms transactions and adds details', async () => {
        const repository = getMockL2CostsRepository()
        const updater = new L2CostsUpdater(
          repository,
          getMockViemRpcClient(),
          Logger.SILENT,
        )

        const transactions = getMockTrackedTxResults()

        const result = await updater.addDetailsTransactionsAndTransform(
          transactions,
        )

        const expected: L2CostsRecord[] = [
          {
            txHash: transactions[0].hash,
            timestamp: transactions[0].blockTimestamp,
            trackedTxId: transactions[0].use.id,
            data: {
              type: 2,
              gasUsed: transactions[0].receiptGasUsed,
              gasPrice: transactions[0].gasPrice,
              //  input: 0x00aa00bbff
              calldataLength: 5,
              calldataGasUsed: 4 * 2 + 3 * 16,
            },
          },
          {
            txHash: transactions[1].hash,
            timestamp: transactions[1].blockTimestamp,
            trackedTxId: transactions[1].use.id,
            data: {
              type: 3,
              gasUsed: transactions[1].receiptGasUsed,
              gasPrice: transactions[1].gasPrice,
              //  input: 0x00aa00bbff
              calldataLength: 5,
              calldataGasUsed: 4 * 2 + 3 * 16,
              blobGasPrice: 10,
              blobGasUsed: 100,
            },
          },
        ]

        expect(result).toEqual(expected)
      })
    },
  )

  describe(L2CostsUpdater.prototype.deleteAfter.name, () => {
    it('calls repository deleteAfter', async () => {
      const repository = getMockL2CostsRepository()
      const updater = new L2CostsUpdater(
        repository,
        getMockViemRpcClient(),
        Logger.SILENT,
      )

      const id = TrackedTxId.random()
      await updater.deleteAfter(id, MIN_TIMESTAMP, TRX)

      expect(repository.deleteAfter).toHaveBeenNthCalledWith(
        1,
        id,
        MIN_TIMESTAMP,
        TRX,
      )
    })
  })
})

const TRX = mockObject<Knex.Transaction>({})

function getMockViemRpcClient() {
  return mockObject<ViemRpcClient>({
    getTransaction: mockFn().resolvesTo({ input: '0x00aa00bbff' }),
    getTransactionReceipt: mockFn().resolvesTo({
      blobGasPrice: BigInt(10),
      blobGasUsed: BigInt(100),
    }),
  })
}

function getMockL2CostsRepository() {
  return mockObject<L2CostsRepository>({
    deleteAfter: async () => 0,
    runInTransaction: async (fn) => fn(TRX),
    addMany: async () => 0,
  })
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
      receiptGasUsed: 100,
      gasPrice: 10,
      transactionType: 2,
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
      receiptGasUsed: 200,
      gasPrice: 20,
      transactionType: 3,
    },
  ]
}
