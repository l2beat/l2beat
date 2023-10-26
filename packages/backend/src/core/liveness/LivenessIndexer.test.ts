import { Logger } from '@l2beat/backend-tools'
import {
  BigQueryClient,
  BigQueryFunctionCallsResult,
  BigQueryTransfersResult,
} from '@l2beat/shared'
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
import {
  adjustToForBigqueryCall,
  LivenessIndexer,
  mergeConfigs,
} from './LivenessIndexer'
import {
  LivenessConfig,
  LivenessFunctionCall,
  LivenessTransfer,
} from './types/LivenessConfig'
import {
  getLivenessConfigHash,
  isTimestampInRange,
  transformFunctionCallsQueryResult,
  transformTransfersQueryResult,
} from './utils'

const ADDRESS_1 = EthereumAddress.random()
const ADDRESS_2 = EthereumAddress.random()
const ADDRESS_3 = EthereumAddress.random()
const ADDRESS_4 = EthereumAddress.random()
const ADDRESS_5 = EthereumAddress.random()
const ADDRESS_6 = EthereumAddress.random()

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
              },
            ],
            functionCalls: [],
          },
        },
      ]

      const bigQueryClient = mockObject<BigQueryClient>({
        getTransfers: () => {
          throw new Error('error')
        },
      })

      const livenessIndexer = new LivenessIndexer(
        logger,
        hourlyIndexer,
        projects,
        bigQueryClient,
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

    it('schedules sync for daily if possible', async () => {
      const bigQueryClient = mockObject<BigQueryClient>({
        getTransfers: async () => [],
        getFunctionCalls: async () => [],
      })

      const PROJECT: Project = {
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
            },
          ],
          functionCalls: [
            {
              projectId: ProjectId('project1'),
              address: ADDRESS_1,
              selector: '0x12345678',
              type: 'STATE',
              sinceTimestamp: FROM,
            },
          ],
        },
      }
      const livenessIndexer = new LivenessIndexer(
        logger,
        hourlyIndexer,
        [PROJECT],
        bigQueryClient,
        stateRepository,
        livenessRepository,
        FROM,
      )

      const from = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))
      const to = UnixTime.fromDate(new Date('2022-01-03T01:00:00Z'))

      await livenessIndexer.update(from.toNumber(), to.toNumber())

      expect(bigQueryClient.getFunctionCalls).toHaveBeenCalledWith(
        [PROJECT.livenessConfig!.functionCalls[0]],
        from,
        from.add(1, 'days'),
      )

      expect(bigQueryClient.getTransfers).toHaveBeenCalledWith(
        [PROJECT.livenessConfig!.transfers[0]],
        from,
        from.add(1, 'days'),
      )
    })

    it('calls getLivenessData and adds results to database', async () => {
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
                address: ADDRESS_5,
                selector: '0x9aaab648',
                sinceTimestamp: FROM,
                type: 'STATE',
              },
            ],
          },
        },
      ]
      const transfers = [
        {
          block_number: 1,
          block_timestamp: { value: FROM.toDate().toISOString() },
          from_address: ADDRESS_1,
          to_address: ADDRESS_2,
          transaction_hash: '0xabcdef1234567890',
        },
      ]

      const functionCalls = [
        {
          block_number: 2,
          block_timestamp: {
            value: FROM.add(1, 'minutes').toDate().toISOString(),
          },
          input: '0x9aaab648',
          to_address: ADDRESS_5,
          transaction_hash: '0xabcdef1234567891',
        },
      ]

      const bigQueryClient = mockObject<BigQueryClient>({
        getTransfers: mockFn().resolvesToOnce(
          BigQueryTransfersResult.parse(transfers),
        ),
        getFunctionCalls: mockFn().resolvesToOnce(
          BigQueryFunctionCallsResult.parse(functionCalls),
        ),
      })
      const livenessIndexer = new LivenessIndexer(
        logger,
        hourlyIndexer,
        projects,
        bigQueryClient,
        stateRepository,
        livenessRepository,
        FROM,
      )
      await livenessIndexer.update(FROM.toNumber(), TO.toNumber())

      const config: LivenessConfig = mergeConfigs(projects)
      const transfersConfig = config.transfers.filter((c) =>
        isTimestampInRange(c.sinceTimestamp, c.untilTimestamp, FROM, TO),
      )
      const functionCallsConfig = config.functionCalls.filter((c) =>
        isTimestampInRange(c.sinceTimestamp, c.untilTimestamp, FROM, TO),
      )

      const expectedToSave: LivenessRecord[] = [
        ...transformTransfersQueryResult(
          transfersConfig,
          BigQueryTransfersResult.parse(transfers),
        ),
        ...transformFunctionCallsQueryResult(
          functionCallsConfig,
          BigQueryFunctionCallsResult.parse(functionCalls),
        ),
      ]

      expect(bigQueryClient.getTransfers).toHaveBeenCalledWith(
        transfersConfig,
        FROM,
        TO,
      )
      expect(bigQueryClient.getFunctionCalls).toHaveBeenCalledWith(
        functionCallsConfig,
        FROM,
        TO,
      )
      expect(livenessRepository.addMany).toHaveBeenCalledWith(expectedToSave)
    })
  })

  describe(LivenessIndexer.prototype.getLivenessData.name, () => {
    it('prepares config properly and calls internal methods', async () => {
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
                untilTimestamp: FROM.add(-1, 'days'),
              },
            ],
            functionCalls: [
              {
                projectId: ProjectId('project1'),
                address: ADDRESS_5,
                selector: '0x9aaab648',
                sinceTimestamp: FROM,
                type: 'DA',
              },
            ],
          },
        },
        {
          projectId: ProjectId('project2'),
          escrows: [],
          type: 'layer2',
          livenessConfig: {
            transfers: [
              {
                projectId: ProjectId('project2'),
                from: ADDRESS_3,
                to: ADDRESS_4,
                type: 'STATE',
                sinceTimestamp: FROM,
              },
            ],
            functionCalls: [
              {
                projectId: ProjectId('project2'),
                address: ADDRESS_6,
                selector: '0x7739cbe7',
                type: 'STATE',
                untilTimestamp: FROM.add(-1, 'days'),
                sinceTimestamp: FROM,
              },
            ],
          },
        },
      ]

      const bigQueryClient = mockObject<BigQueryClient>({
        getTransfers: mockFn().resolvesToOnce(
          BigQueryTransfersResult.parse([]),
        ),
        getFunctionCalls: mockFn().resolvesToOnce(
          BigQueryFunctionCallsResult.parse([]),
        ),
      })

      const livenessIndexer = new LivenessIndexer(
        Logger.SILENT,
        hourlyIndexer,
        projects,
        bigQueryClient,
        stateRepository,
        livenessRepository,
        FROM,
      )
      await livenessIndexer.getLivenessData(projects, FROM, TO)
      const config: LivenessConfig = mergeConfigs(projects)

      const transfersConfig = config.transfers.filter((c) =>
        isTimestampInRange(c.sinceTimestamp, c.untilTimestamp, FROM, TO),
      )
      expect(bigQueryClient.getTransfers).toHaveBeenNthCalledWith(
        1,
        transfersConfig,
        FROM,
        TO,
      )
      const functionCallsConfig = config.functionCalls.filter((c) =>
        isTimestampInRange(c.sinceTimestamp, c.untilTimestamp, FROM, TO),
      )
      expect(bigQueryClient.getFunctionCalls).toHaveBeenNthCalledWith(
        1,
        functionCallsConfig,
        FROM,
        TO,
      )
    })
  })

  describe(LivenessIndexer.prototype.getTransfers.name, () => {
    it('should fetch and transform data properly', async () => {
      const queryResults: BigQueryTransfersResult = [
        {
          block_number: 1,
          block_timestamp: FROM,
          from_address: ADDRESS_1,
          to_address: ADDRESS_2,
          transaction_hash: '0xabcdef1234567890',
        },
        {
          block_number: 2,
          block_timestamp: FROM,
          from_address: ADDRESS_3,
          to_address: ADDRESS_4,
          transaction_hash: '0xabcdef1234567891',
        },
      ]

      const bigQueryClient = mockObject<BigQueryClient>({
        getTransfers: mockFn().resolvesToOnce(queryResults),
      })

      const projects: Project[] = [
        {
          projectId: ProjectId('project1'),
          escrows: [],
          type: 'layer2',
          livenessConfig: {
            transfers: [
              {
                from: ADDRESS_1,
                to: ADDRESS_2,
                type: 'DA',
                projectId: ProjectId('project1'),
                sinceTimestamp: FROM,
              },
            ],
            functionCalls: [],
          },
        },
        {
          projectId: ProjectId('project2'),
          escrows: [],
          type: 'layer2',
          livenessConfig: {
            transfers: [
              {
                from: ADDRESS_3,
                to: ADDRESS_4,
                type: 'STATE',
                projectId: ProjectId('project2'),
                sinceTimestamp: FROM,
              },
            ],
            functionCalls: [],
          },
        },
      ]

      const expected: LivenessRecord[] = [
        {
          projectId: ProjectId('project1'),
          timestamp: FROM,
          blockNumber: 1,
          txHash: '0xabcdef1234567890',
          type: 'DA',
        },
        {
          projectId: ProjectId('project2'),
          timestamp: FROM,
          blockNumber: 2,
          txHash: '0xabcdef1234567891',
          type: 'STATE',
        },
      ]

      const livenessIndexer = new LivenessIndexer(
        Logger.SILENT,
        hourlyIndexer,
        projects,
        bigQueryClient,
        stateRepository,
        livenessRepository,
        FROM,
      )
      const expectedConfig: LivenessTransfer[] = [
        projects[0].livenessConfig!.transfers[0],
        projects[1].livenessConfig!.transfers[0],
      ]
      const results = await livenessIndexer.getTransfers(
        expectedConfig,
        FROM,
        TO,
      )

      expect(results).toEqual(expected)
      expect(bigQueryClient.getTransfers).toHaveBeenNthCalledWith(
        1,
        expectedConfig,
        FROM,
        TO,
      )
    })

    it('does not call BigQuery if configs are empty', async () => {
      const bigQueryClient = mockObject<BigQueryClient>({
        getTransfers: async () => [],
      })

      const livenessIndexer = new LivenessIndexer(
        Logger.SILENT,
        hourlyIndexer,
        [],
        bigQueryClient,
        stateRepository,
        livenessRepository,
        FROM,
      )

      await livenessIndexer.getTransfers([], FROM, TO)

      expect(bigQueryClient.getTransfers).not.toHaveBeenCalled()
    })
  })

  describe(LivenessIndexer.prototype.getFunctionCalls.name, () => {
    it('should fetch and transform data properly', async () => {
      const queryResults: BigQueryFunctionCallsResult = [
        {
          block_number: 1,
          block_timestamp: FROM,
          input: '0x9aaab648',
          to_address: ADDRESS_2,
          transaction_hash: '0xabcdef1234567890',
        },
        {
          block_number: 2,
          block_timestamp: FROM,
          input: '0x7739cbe7',
          to_address: ADDRESS_4,
          transaction_hash: '0xabcdef1234567891',
        },
      ]

      const bigQueryClient = mockObject<BigQueryClient>({
        getFunctionCalls: mockFn().resolvesToOnce(queryResults),
      })

      const projects: Project[] = [
        {
          projectId: ProjectId('project1'),
          escrows: [],
          type: 'layer2',
          livenessConfig: {
            transfers: [],
            functionCalls: [
              {
                address: ADDRESS_2,
                selector: '0x9aaab648',
                type: 'DA',
                projectId: ProjectId('project1'),
                sinceTimestamp: FROM,
              },
            ],
          },
        },
        {
          projectId: ProjectId('project2'),
          escrows: [],
          type: 'layer2',
          livenessConfig: {
            transfers: [],
            functionCalls: [
              {
                address: ADDRESS_4,
                selector: '0x7739cbe7',
                type: 'STATE',
                projectId: ProjectId('project2'),
                sinceTimestamp: FROM,
              },
            ],
          },
        },
      ]

      const expected: LivenessRecord[] = [
        {
          projectId: ProjectId('project1'),
          timestamp: FROM,
          blockNumber: 1,
          txHash: '0xabcdef1234567890',
          type: 'DA',
        },
        {
          projectId: ProjectId('project2'),
          timestamp: FROM,
          blockNumber: 2,
          txHash: '0xabcdef1234567891',
          type: 'STATE',
        },
      ]

      const livenessIndexer = new LivenessIndexer(
        Logger.SILENT,
        hourlyIndexer,
        projects,
        bigQueryClient,
        stateRepository,
        livenessRepository,
        FROM,
      )
      const expectedConfig: LivenessFunctionCall[] = [
        projects[0].livenessConfig!.functionCalls[0],
        projects[1].livenessConfig!.functionCalls[0],
      ]
      const results = await livenessIndexer.getFunctionCalls(
        expectedConfig,
        FROM,
        TO,
      )

      expect(results).toEqual(expected)
      expect(bigQueryClient.getFunctionCalls).toHaveBeenNthCalledWith(
        1,
        expectedConfig,
        FROM,
        TO,
      )
    })

    it('does not call BigQuery if configs are empty', async () => {
      const bigQueryClient = mockObject<BigQueryClient>({
        getFunctionCalls: async () => [],
      })

      const livenessIndexer = new LivenessIndexer(
        Logger.SILENT,
        hourlyIndexer,
        [],
        bigQueryClient,
        stateRepository,
        livenessRepository,
        FROM,
      )

      await livenessIndexer.getFunctionCalls([], FROM, TO)

      expect(bigQueryClient.getFunctionCalls).not.toHaveBeenCalled()
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
        indexerId: livenessIndexer.getIndexerId(),
        configHash: livenessIndexer.getConfigHash(),
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

function getMockLivenessIndexer(
  projects: Project[],
  configHash: Hash256 | undefined,
) {
  const bigQueryClient = mockObject<BigQueryClient>({})

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
    bigQueryClient,
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

describe(adjustToForBigqueryCall.name, () => {
  it('the same day', () => {
    const from = UnixTime.fromDate(new Date('2022-01-01T12:00:00Z'))

    const result = adjustToForBigqueryCall(
      from.toNumber(),
      from.add(1, 'hours').toNumber(),
    )

    expect(result).toEqual(UnixTime.fromDate(new Date('2022-01-01T13:00:00Z')))
  })

  it('different days', () => {
    const from = UnixTime.fromDate(new Date('2022-01-01T12:00:00Z'))
    const to = UnixTime.fromDate(new Date('2022-01-02T12:00:00Z'))

    const result = adjustToForBigqueryCall(from.toNumber(), to.toNumber())
    expect(result).toEqual(UnixTime.fromDate(new Date('2022-01-02T00:00:00Z')))
  })
})
