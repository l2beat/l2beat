import { Logger } from '@l2beat/backend-tools'
import {
  EthereumAddress,
  Hash256,
  hashJson,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { Project } from '../../model'
import { IndexerStateRepository } from '../../peripherals/database/IndexerStateRepository'
import {
  LivenessRecord,
  LivenessRepository,
} from '../../peripherals/database/LivenessRepository'
import { HourlyIndexer } from './HourlyIndexer'
import { LivenessClient, mergeConfigs } from './LivenessClient'
import { LivenessIndexer } from './LivenessIndexer'
import {
  LivenessConfig,
  LivenessFunctionCall,
  LivenessTransfer,
} from './types/LivenessConfig'
import {
  BigQueryFunctionCallsResult,
  BigQueryTransfersResult,
} from './types/model'
import {
  getLivenessConfigHash,
  isTimestampInRange,
  transformFunctionCallsQueryResult,
  transformTransfersQueryResult,
} from './utils'

describe(LivenessIndexer.name, () => {
  describe(LivenessIndexer.prototype.start.name, () => {
    const PROJECTS: Project[] = []

    it('undefined config hash', async () => {
      const DB_CONFIG_HASH = undefined

      const {
        livenessIndexer,
        stateRepository,
        indexerConfigHash,
        minTimestamp,
      } = getMockLivenessIndexer(PROJECTS, DB_CONFIG_HASH)
      await livenessIndexer.start()

      expect(stateRepository.addOrUpdate).toHaveBeenCalledWith({
        indexerId: 'liveness_indexer',
        configHash: indexerConfigHash,
        safeHeight: minTimestamp.toNumber(),
      })
    })

    it('different config hash', async () => {
      const DB_CONFIG_HASH = hashJson('different-config-hash')

      const {
        livenessIndexer,
        stateRepository,
        indexerConfigHash,
        minTimestamp,
      } = getMockLivenessIndexer(PROJECTS, DB_CONFIG_HASH)
      await livenessIndexer.start()

      expect(stateRepository.addOrUpdate).toHaveBeenCalledWith({
        indexerId: 'liveness_indexer',
        configHash: indexerConfigHash,
        safeHeight: minTimestamp.toNumber(),
      })
    })

    it('the same config hash', async () => {
      const DB_CONFIG_HASH = getLivenessConfigHash(PROJECTS)

      const { livenessIndexer, stateRepository, indexerConfigHash } =
        getMockLivenessIndexer(PROJECTS, DB_CONFIG_HASH)

      await livenessIndexer.start()

      expect(stateRepository.addOrUpdate).not.toHaveBeenCalled()
      expect(indexerConfigHash).toEqual(DB_CONFIG_HASH)
    })
  })

  describe(LivenessIndexer.prototype.update.name, () => {
    it('handles error', async () => {
      const livenessClient = mockObject<LivenessClient>({
        getTransfers: () => {
          throw new Error('error')
        },
      })

      const livenessIndexer = new LivenessIndexer(
        logger,
        hourlyIndexer,
        projects,
        livenessClient,
        stateRepository,
        livenessRepository,
        FROM,
      )

      await expect(
        async () =>
          await livenessIndexer.update(FROM.toNumber(), TO.toNumber()),
      ).toBeRejected()

      expect(wrappedLogger.error).toHaveBeenCalled()
    })

    it('calls getLivenessData and adds results to database, returns "to"', async () => {
      const expectedToSave: LivenessRecord[] = [
        ...TRANSFERS_EXPECTED,
        ...FUNCTIONS_EXPECTED,
      ]
      const livenessClient = mockObject<LivenessClient>({
        getLivenessData: mockFn().resolvesTo({
          data: expectedToSave,
          to: TO,
        }),
      })

      const livenessIndexer = getMockLivenessIndexer(
        projects,
        undefined,
        livenessClient,
      ).livenessIndexer

      const currentTo = await livenessIndexer.update(
        FROM.toNumber(),
        TO.toNumber(),
      )

      expect(livenessClient.getLivenessData).toHaveBeenCalledWith(
        projects,
        FROM,
        TO,
      )
      expect(currentTo).toEqual(TO.toNumber())
      expect(livenessRepository.addMany).toHaveBeenCalledWith(expectedToSave)
    })
  })

  describe(LivenessIndexer.prototype.getSafeHeight.name, () => {
    it('should return valid value', async () => {
      const livenessIndexer = getMockLivenessIndexer(
        [],
        undefined,
      ).livenessIndexer
      const safeHeight = await livenessIndexer.getSafeHeight()
      expect(safeHeight).toEqual(1)
    })
  })

  describe(LivenessIndexer.prototype.setSafeHeight.name, () => {
    it('should be called with valid parameters', async () => {
      const mock = getMockLivenessIndexer([], undefined)
      const livenessIndexer = mock.livenessIndexer
      const stateRepository = mock.stateRepository
      await livenessIndexer.setSafeHeight(12)

      expect(stateRepository.addOrUpdate).toHaveBeenCalledWith({
        safeHeight: 12,
        indexerId: 'liveness_indexer',
        configHash: mock.indexerConfigHash,
      })
    })
  })

  describe(LivenessIndexer.prototype.invalidate.name, () => {
    it('should return its parameter', async () => {
      const mock = getMockLivenessIndexer([], undefined)
      const livenessIndexer = mock.livenessIndexer
      const value = await livenessIndexer.invalidate(1)

      expect(value).toEqual(1)
    })
  })
})

// MOCKS

function getMockLivenessIndexer(
  projects: Project[],
  configHash: Hash256 | undefined,
  providedLivenessClient?: LivenessClient,
) {
  const livenessClient =
    providedLivenessClient ?? mockObject<LivenessClient>({})

  const stateRepository = mockObject<IndexerStateRepository>({
    findSafeHeight() {
      return Promise.resolve(1)
    },
    addOrUpdate() {
      return Promise.resolve('')
    },
    findConfigHash() {
      return Promise.resolve(configHash)
    },
  })

  const livenessIndexer = new LivenessIndexer(
    Logger.SILENT,
    hourlyIndexer,
    projects,
    livenessClient,
    stateRepository,
    livenessRepository,
    FROM,
  )

  return {
    livenessIndexer,
    stateRepository,
    indexerConfigHash: getLivenessConfigHash(projects),
    minTimestamp: FROM,
  }
}

function getFilteredConfigs(
  projects: Project[],
  from: UnixTime,
  to: UnixTime,
): {
  transfers: LivenessTransfer[]
  functionCalls: LivenessFunctionCall[]
} {
  const config: LivenessConfig = mergeConfigs(projects)

  const transfers = config.transfers.filter((c) =>
    isTimestampInRange(c.sinceTimestamp, c.untilTimestamp, from, to),
  )

  const functionCalls = config.functionCalls.filter((c) =>
    isTimestampInRange(c.sinceTimestamp, c.untilTimestamp, from, to),
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

const hourlyIndexer = mockObject<HourlyIndexer>({
  start: async () => {},
  tick: async () => 1,
  subscribe: () => {},
})
const stateRepository = mockObject<IndexerStateRepository>({
  findSafeHeight() {
    return Promise.resolve(1)
  },
  addOrUpdate() {
    return Promise.resolve('')
  },
  getAll() {
    return Promise.resolve([])
  },
  deleteAll() {
    return Promise.resolve(1)
  },
  findConfigHash() {
    return Promise.resolve(hashJson('test'))
  },
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
})

const wrappedLogger = mockObject<Logger>({
  error: () => {},
  debug: () => {},
})

const logger = mockObject<Logger>({
  for: () => wrappedLogger,
})

const projects: Project[] = [
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
  getFilteredConfigs(projects, FROM, TO).transfers,
  BigQueryTransfersResult.parse(TRANSFER_RESPONSE),
)

const FUNCTIONS_EXPECTED = transformFunctionCallsQueryResult(
  getFilteredConfigs(projects, FROM, TO).functionCalls,
  BigQueryFunctionCallsResult.parse(FUNCTIONS_RESPONSE),
)
