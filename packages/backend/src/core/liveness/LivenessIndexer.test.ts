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
import { LivenessIndexer, mergeConfigs } from './LivenessIndexer'
import { LivenessConfig, LivenessTransfer } from './types/LivenessConfig'
import { getLivenessConfigHash, isTimestampInRange } from './utils'

const ADDRESS_1 = EthereumAddress.random()
const ADDRESS_2 = EthereumAddress.random()
const ADDRESS_3 = EthereumAddress.random()
const ADDRESS_4 = EthereumAddress.random()
const ADDRESS_5 = EthereumAddress.random()
const ADDRESS_6 = EthereumAddress.random()

const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))
const TO = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))

const hourlyIndexer = mockObject<HourlyIndexer>({
  start: async () => {},
  tick: async () => 1,
  subscribe: () => {},
})
const stateRepository = mockObject<IndexerStateRepository>({
  getSafeHeight() {
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
  getConfigHash() {
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

describe(LivenessIndexer.name, () => {
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
  describe(LivenessIndexer.prototype.update.name, () => {
    it('throws error', async () => {
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
            functionCalls: [],
          },
        },
      ]

      const bigQueryClient = mockObject<BigQueryClient>({
        getTransfers: () => {
          throw new Error('error')
        },
      })

      const wrappedLogger = mockObject<Logger>({
        error: () => {},
        debug: () => {},
      })

      const logger = mockObject<Logger>({
        for: () => wrappedLogger,
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
  })

  describe(LivenessIndexer.prototype.start.name, () => {
    const PROJECTS: Project[] = []

    it('undefined config hash', async () => {
      const CONFIG_HASH = undefined

      const { livenessIndexer, stateRepository } = getMockLivenessIndexer(
        PROJECTS,
        CONFIG_HASH,
      )
      await livenessIndexer.start()

      expect(stateRepository.addOrUpdate).toHaveBeenCalledWith({
        indexerId: livenessIndexer.getIndexerId(),
        configHash: livenessIndexer.getConfigHash(),
        safeHeight: 0,
      })
    })

    it('different config hash', async () => {
      const CONFIG_HASH = hashJson('different-config-hash')

      const { livenessIndexer, stateRepository } = getMockLivenessIndexer(
        PROJECTS,
        CONFIG_HASH,
      )
      await livenessIndexer.start()

      expect(stateRepository.addOrUpdate).toHaveBeenCalledWith({
        indexerId: livenessIndexer.getIndexerId(),
        configHash: livenessIndexer.getConfigHash(),
        safeHeight: 0,
      })
    })

    it('the same config hash', async () => {
      const CONFIG_HASH = getLivenessConfigHash(PROJECTS)

      const { livenessIndexer, stateRepository } = getMockLivenessIndexer(
        PROJECTS,
        CONFIG_HASH,
      )

      await livenessIndexer.start()

      expect(stateRepository.addOrUpdate).not.toHaveBeenCalled()
    })
  })
})

function getMockLivenessIndexer(
  projects: Project[],
  configHash: Hash256 | undefined,
) {
  const bigQueryClient = mockObject<BigQueryClient>({})

  const stateRepository = mockObject<IndexerStateRepository>({
    getSafeHeight() {
      return Promise.resolve(1)
    },
    addOrUpdate() {
      return Promise.resolve('')
    },
    getConfigHash() {
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
  return { livenessIndexer, stateRepository }
}
