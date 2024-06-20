import { Logger } from '@l2beat/backend-tools'
import {
  EthereumAddress,
  ProjectId,
  TrackedTxsConfigType,
  UnixTime,
} from '@l2beat/shared-pure'
import { mockFn, mockObject } from 'earl'
import { Knex } from 'knex'

import { IndexerStateRepository } from '../../tools/uif/IndexerStateRepository'
import { HourlyIndexer } from '../tracked-txs/HourlyIndexer'
import { TrackedTxsClient } from '../tracked-txs/TrackedTxsClient'
import { TrackedTxsIndexer } from './TrackedTxsIndexer'
import {
  TrackedTxsConfigRecord,
  TrackedTxsConfigsRepository,
} from './repositories/TrackedTxsConfigsRepository'
import { TrackedTxId } from './types/TrackedTxId'
import { TrackedTxConfigEntry } from './types/TrackedTxsConfig'
import { TxUpdaterInterface } from './types/TxUpdaterInterface'
import { TrackedTxResult } from './types/model'

const MIN_TIMESTAMP = UnixTime.fromDate(new Date('2023-05-01T00:00:00Z'))
const TRX = mockObject<Knex.Transaction>({})

describe(TrackedTxsIndexer.name, () => {
  describe(TrackedTxsIndexer.prototype.update.name, () => {})
})

function getMockTrackedTxsIndexer(params: {
  stateRepository?: IndexerStateRepository
  configRepository?: TrackedTxsConfigsRepository
  configs?: TrackedTxConfigEntry[]
  trackedTxsClient?: TrackedTxsClient
  updaters?: Record<TrackedTxsConfigType, TxUpdaterInterface>
}) {
  const {
    stateRepository,
    configRepository,
    configs,
    trackedTxsClient,
    updaters,
  } = params

  return new TrackedTxsIndexer(
    Logger.SILENT,
    mockObject<HourlyIndexer>({
      start: async () => {},
      tick: async () => 1,
      subscribe: () => {},
    }),
    updaters ?? {
      liveness: mockObject<TxUpdaterInterface>({}),
      l2costs: mockObject<TxUpdaterInterface>({}),
    },
    trackedTxsClient ?? mockObject<TrackedTxsClient>({}),
    stateRepository ?? mockObject<IndexerStateRepository>({}),
    configRepository ?? mockObject<TrackedTxsConfigsRepository>({}),
    configs ?? [],
    MIN_TIMESTAMP,
  )
}

function getMockConfigRepository(databaseEntries: TrackedTxsConfigRecord[]) {
  return mockObject<TrackedTxsConfigsRepository>({
    addMany: async () => [],
    deleteMany: async () => 0,
    setUntilTimestamp: async () => 0,
    getAll: async () => databaseEntries,
    setManyLastSyncedTimestamp: async () => 0,
    setLastSyncedTimestamp: async () => 0,
    runInTransaction: mockFn(async (fn) => fn(TRX)),
  })
}

function getMockStateRepository(
  indexerState = {
    indexerId: 'tracked_txs_indexer',
    safeHeight: MIN_TIMESTAMP.toNumber(),
    minTimestamp: MIN_TIMESTAMP,
  },
) {
  const stateRepository = mockObject<IndexerStateRepository>({
    findIndexerState: async () => indexerState,
    addOrUpdate: async () => '',
    setSafeHeight: async () => 0,
    runInTransaction: async (fn) => fn(TRX),
  })
  return stateRepository
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
    {
      formula: 'functionCall',
      projectId: ProjectId('test3'),
      address: EthereumAddress.random(),
      selector: '0x',
      sinceTimestampInclusive: MIN_TIMESTAMP,
      uses: [
        {
          type: 'liveness',
          subtype: 'proofSubmissions',
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
      gasPrice: 10n,
      receiptGasUsed: 100,
      calldataGasUsed: 10,
      dataLength: 5,
      receiptBlobGasPrice: null,
      receiptBlobGasUsed: null,
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
      gasPrice: 20n,
      receiptGasUsed: 200,
      calldataGasUsed: 0,
      dataLength: 0,
      receiptBlobGasPrice: null,
      receiptBlobGasUsed: null,
    },
    {
      type: 'transfer',
      use: {
        id: getMockRuntimeConfigurations()[1].uses[0].id,
        type: 'l2costs',
        subtype: 'stateUpdates',
      },
      blockNumber: 1,
      blockTimestamp: UnixTime.now(),
      hash: '',
      fromAddress: EthereumAddress.random(),
      toAddress: EthereumAddress.random(),
      projectId: ProjectId('test2'),
      gasPrice: 20n,
      receiptGasUsed: 200,
      calldataGasUsed: 0,
      dataLength: 0,
      receiptBlobGasPrice: null,
      receiptBlobGasUsed: null,
    },
  ]
}

function toRecords(
  entry: TrackedTxConfigEntry,
  lastSyncedTimestamp?: UnixTime,
): TrackedTxsConfigRecord[] {
  return entry.uses.map((use) => ({
    id: use.id,
    projectId: entry.projectId,
    type: use.type,
    subtype: use.subtype,
    sinceTimestampInclusive: entry.sinceTimestampInclusive,
    untilTimestampExclusive: entry.untilTimestampExclusive,
    debugInfo: '',
    lastSyncedTimestamp,
  }))
}
