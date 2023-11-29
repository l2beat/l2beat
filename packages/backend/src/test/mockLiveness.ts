import { Logger } from '@l2beat/backend-tools'
import {
  EthereumAddress,
  Hash256,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { MockObject, mockObject } from 'earl'
import { Knex } from 'knex'

import { HourlyIndexer } from '../core/liveness/HourlyIndexer'
import { LivenessClient } from '../core/liveness/LivenessClient'
import { LivenessIndexer } from '../core/liveness/LivenessIndexer'
import {
  LivenessFunctionCall,
  LivenessTransfer,
} from '../core/liveness/types/LivenessConfig'
import { LivenessConfigurationIdentifier } from '../core/liveness/types/LivenessConfigurationIdentifier'
import {
  BigQueryFunctionCallsResult,
  BigQueryTransfersResult,
} from '../core/liveness/types/model'
import {
  getLivenessConfigHash,
  isTimestampInRange,
  mergeConfigs,
  transformFunctionCallsQueryResult,
  transformTransfersQueryResult,
} from '../core/liveness/utils'
import { Project } from '../model'
import {
  IndexerStateRecord,
  IndexerStateRepository,
} from '../peripherals/database/IndexerStateRepository'
import {
  LivenessConfigurationRecord,
  LivenessConfigurationRepository,
} from '../peripherals/database/LivenessConfigurationRepository'
import { LivenessRepository } from '../peripherals/database/LivenessRepository'

const MOCK_TRX = mockObject<Knex.Transaction>({})

function getMockLivenessIndexer(mocks: {
  projects?: Project[]
  configHash?: Hash256
  livenessClient?: MockObject<LivenessClient>
  configurationRepository?: MockObject<LivenessConfigurationRepository>
  stateRepository?: MockObject<IndexerStateRepository>
}) {
  const livenessClient = mocks.livenessClient ?? mockObject<LivenessClient>({})

  const indexerState: IndexerStateRecord | undefined = mocks.configHash
    ? {
        indexerId: 'liveness_indexer',
        configHash: mocks.configHash,
        safeHeight: 1,
        minTimestamp: FROM,
      }
    : undefined

  const stateRepository =
    mocks.stateRepository ??
    mockObject<IndexerStateRepository>({
      add() {
        return Promise.resolve('')
      },
      findIndexerState() {
        return Promise.resolve(indexerState)
      },
      setSafeHeight: async () => -1,
      setConfigHash: async () => -1,
      runInTransaction: async (
        fun: (trx: Knex.Transaction) => Promise<void>,
      ) => {
        await fun(MOCK_TRX)
      },
    })

  const configurationRepository =
    mocks.configurationRepository ??
    mockObject<LivenessConfigurationRepository>({
      getAll: async () =>
        CONFIGURATIONS.map((c, i) => ({
          ...c,
          id: i,
          lastSyncedTimestamp: undefined,
        })),
      setLastSyncedTimestamp: async () => -1,
      setUntilTimestamp: async () => -1,
      addMany: async () => [],
      deleteMany: async () => -1,
    })

  const wrappedLogger = mockObject<Logger>({
    error: () => {},
    debug: () => {},
    trace: () => {},
    info: () => {},
  })

  const logger = mockObject<Logger>({
    for: () => wrappedLogger,
  })

  const hourlyIndexer = mockObject<HourlyIndexer>({
    start: async () => {},
    tick: async () => 1,
    subscribe: () => {},
  })

  const livenessRepository = mockObject<LivenessRepository>({
    getAll() {
      return Promise.resolve([])
    },
    addMany() {
      return Promise.resolve(1)
    },
    deleteAll() {
      return Promise.resolve(1)
    },
    deleteAfter: async () => -1,
    runInTransaction: async (fun: (trx: Knex.Transaction) => Promise<void>) => {
      await fun(MOCK_TRX)
    },
  })

  const livenessIndexer = new LivenessIndexer(
    logger,
    hourlyIndexer,
    mocks.projects ?? PROJECTS,
    livenessClient,
    stateRepository,
    livenessRepository,
    configurationRepository,
    FROM,
  )

  return {
    livenessIndexer,
    stateRepository,
    livenessRepository,
    wrappedLogger,
    configurationRepository,
    indexerConfigHash: getLivenessConfigHash(mocks.projects ?? PROJECTS),
    minTimestamp: FROM,
  }
}

function getFilteredConfigs(
  projects: Project[],
  configs: LivenessConfigurationRecord[],
  from: UnixTime,
  to: UnixTime,
): {
  transfers: LivenessTransfer[]
  functionCalls: LivenessFunctionCall[]
} {
  const config = mergeConfigs(projects, configs)

  const transfers = config.transfers.filter((c) =>
    isTimestampInRange(
      c.sinceTimestamp,
      c.untilTimestamp,
      c.latestSyncedTimestamp,
      from,
      to,
    ),
  )

  const functionCalls = config.functionCalls.filter((c) =>
    isTimestampInRange(
      c.sinceTimestamp,
      c.untilTimestamp,
      c.latestSyncedTimestamp,
      from,
      to,
    ),
  )

  return {
    transfers,
    functionCalls,
  }
}

const ADDRESS_1 = EthereumAddress.random()
const ADDRESS_2 = EthereumAddress.random()
const ADDRESS_3 = EthereumAddress.random()

const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))
const TO = UnixTime.fromDate(new Date('2022-01-01T02:00:00Z'))

const PROJECTS: Project[] = [
  {
    projectId: ProjectId('project1'),
    escrows: [],
    type: 'layer2',
    livenessConfig: {
      transfers: [
        {
          projectId: ProjectId('project1'),
          from: ADDRESS_1,
          to: ADDRESS_2,
          type: 'DA',
          sinceTimestamp: FROM,
          untilTimestamp: FROM.add(2, 'days'),
        },
      ],
      functionCalls: [
        {
          projectId: ProjectId('project1'),
          address: ADDRESS_3,
          selector: '0x9aaab648',
          sinceTimestamp: FROM,
          type: 'STATE',
        },
      ],
    },
  },
]

const CONFIGURATIONS: LivenessConfigurationRecord[] = [
  {
    id: 0,
    lastSyncedTimestamp: undefined,
    projectId: PROJECTS[0].projectId,
    type: PROJECTS[0].livenessConfig!.transfers[0].type,
    identifier: LivenessConfigurationIdentifier(
      PROJECTS[0].livenessConfig!.transfers[0],
    ),
    params: JSON.stringify({
      from: PROJECTS[0].livenessConfig!.transfers[0].from,
      to: PROJECTS[0].livenessConfig!.transfers[0].to,
    }),
    sinceTimestamp: PROJECTS[0].livenessConfig!.transfers[0].sinceTimestamp,
    untilTimestamp: FROM.add(2, 'days'),
  },
  {
    id: 1,
    lastSyncedTimestamp: undefined,
    projectId: PROJECTS[0].projectId,
    type: PROJECTS[0].livenessConfig!.functionCalls[0].type,
    identifier: LivenessConfigurationIdentifier(
      PROJECTS[0].livenessConfig!.functionCalls[0],
    ),
    params: JSON.stringify({
      address: PROJECTS[0].livenessConfig!.functionCalls[0].address,
      selector: PROJECTS[0].livenessConfig!.functionCalls[0].selector,
    }),
    sinceTimestamp: PROJECTS[0].livenessConfig!.functionCalls[0].sinceTimestamp,
    untilTimestamp: undefined,
  },
]

const TRANSFER_RESPONSE = [
  {
    block_number: 1,
    block_timestamp: { value: FROM.toDate().toISOString() },
    from_address: ADDRESS_1,
    to_address: ADDRESS_2,
    transaction_hash: '0xabcdef1234567890',
  },
]

const FUNCTIONS_RESPONSE = [
  {
    block_number: 2,
    block_timestamp: {
      value: FROM.add(1, 'minutes').toDate().toISOString(),
    },
    input: '0x9aaab648',
    to_address: ADDRESS_3,
    transaction_hash: '0xabcdef1234567891',
  },
]

const TRANSFERS_EXPECTED = transformTransfersQueryResult(
  getFilteredConfigs(PROJECTS, CONFIGURATIONS, FROM, TO).transfers,
  BigQueryTransfersResult.parse(TRANSFER_RESPONSE),
)

const FUNCTIONS_EXPECTED = transformFunctionCallsQueryResult(
  getFilteredConfigs(PROJECTS, CONFIGURATIONS, FROM, TO).functionCalls,
  BigQueryFunctionCallsResult.parse(FUNCTIONS_RESPONSE),
)

export const LIVENESS_MOCK = {
  getMockLivenessIndexer,
  FROM,
  TO,
  PROJECTS,
  CONFIGURATIONS,
  TRANSFERS_EXPECTED,
  FUNCTIONS_EXPECTED,
  MOCK_TRX,
}
