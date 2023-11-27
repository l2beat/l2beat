import { hashJson, LivenessType, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { Knex } from 'knex'

import { Project } from '../../model'
import {
  IndexerStateRecord,
  IndexerStateRepository,
} from '../../peripherals/database/IndexerStateRepository'
import { LivenessConfigurationRepository } from '../../peripherals/database/LivenessConfigurationRepository'
import { LivenessRecord } from '../../peripherals/database/LivenessRepository'
import { LIVENESS_MOCK } from '../../test/mockLiveness'
import { LivenessClient } from './LivenessClient'
import { LivenessIndexer } from './LivenessIndexer'
import {
  adjustToForBigqueryCall,
  getLivenessConfigHash,
  isTimestampInRange,
  mergeConfigs,
} from './utils'

const {
  getMockLivenessIndexer,
  FROM,
  TO,
  PROJECTS,
  CONFIGURATIONS,
  TRANSFERS_EXPECTED,
  FUNCTIONS_EXPECTED,
  MOCK_TRX,
} = LIVENESS_MOCK

describe(LivenessIndexer.name, () => {
  describe(LivenessIndexer.prototype.start.name, () => {
    describe('initialize indexer state', () => {
      it('undefined config hash', async () => {
        const {
          livenessIndexer,
          stateRepository,
          indexerConfigHash,
          minTimestamp,
        } = getMockLivenessIndexer({
          configHash: undefined,
        })
        await livenessIndexer.start()

        expect(stateRepository.add).toHaveBeenCalledWith(
          {
            indexerId: 'liveness_indexer',
            configHash: indexerConfigHash,
            safeHeight: minTimestamp.toNumber(),
            minTimestamp,
          },
          MOCK_TRX,
        )
      })

      it('different config hash', async () => {
        const {
          livenessIndexer,
          stateRepository,
          indexerConfigHash,
          minTimestamp,
        } = getMockLivenessIndexer({
          configHash: hashJson('different-config-hash'),
        })
        await livenessIndexer.start()

        expect(stateRepository.setConfigHash).toHaveBeenCalledWith(
          'liveness_indexer',
          indexerConfigHash,
          MOCK_TRX,
        )
        expect(stateRepository.setSafeHeight).toHaveBeenCalledWith(
          'liveness_indexer',
          minTimestamp.toNumber(),
          MOCK_TRX,
        )
      })

      it('the same config hash', async () => {
        const { livenessIndexer, stateRepository, indexerConfigHash } =
          getMockLivenessIndexer({
            configHash: getLivenessConfigHash(PROJECTS),
          })

        await livenessIndexer.start()

        expect(stateRepository.add).not.toHaveBeenCalled()
        expect(stateRepository.setConfigHash).not.toHaveBeenCalled()
        expect(stateRepository.setSafeHeight).not.toHaveBeenCalled()
        expect(indexerConfigHash).toEqual(getLivenessConfigHash(PROJECTS))
      })

      it('throws when minTimestamp updated', async () => {
        const indexerState: IndexerStateRecord = {
          indexerId: 'liveness_indexer',
          configHash: hashJson('config-hash'),
          safeHeight: 1,
          minTimestamp: FROM.add(30, 'days'),
        }

        const stateRepository = mockObject<IndexerStateRepository>({
          add() {
            return Promise.resolve('')
          },
          findIndexerState() {
            return Promise.resolve(indexerState)
          },
          runInTransaction: async (
            fun: (trx: Knex.Transaction) => Promise<void>,
          ) => {
            await fun(MOCK_TRX)
          },
        })

        const { livenessIndexer } = getMockLivenessIndexer({
          stateRepository,
        })

        await expect(
          async () => await livenessIndexer.start(),
        ).toBeRejectedWith(
          'Minimum timestamp of this indexer cannot be updated',
        )
      })
    })

    describe('initialize configurations', () => {
      it('adds new configurations to the DB', async () => {
        const configurationRepository =
          mockObject<LivenessConfigurationRepository>({
            getAll: async () => CONFIGURATIONS.slice(0, 1),
            addMany: async () => [],
            deleteMany: async () => -1,
          })

        const { livenessIndexer } = getMockLivenessIndexer({
          configurationRepository,
        })
        await livenessIndexer.start()

        expect(configurationRepository.getAll).toHaveBeenCalledTimes(1)
        expect(configurationRepository.addMany).toHaveBeenNthCalledWith(
          1,
          CONFIGURATIONS.slice(1).map((c) => ({
            identifier: c.identifier,
            type: c.type,
            params: c.params,
            sinceTimestamp: c.sinceTimestamp,
            untilTimestamp: c.untilTimestamp,
            projectId: c.projectId,
          })),
          MOCK_TRX,
        )
      })

      it('updates configuration in DB when difference detected', async () => {
        const configurationRepository =
          mockObject<LivenessConfigurationRepository>({
            getAll: async () => CONFIGURATIONS,
            addMany: async () => [],
            setLastSyncedTimestamp: async () => -1,
            setUntilTimestamp: async () => -1,
            deleteMany: async () => -1,
          })

        const newUntilTimestamp = UnixTime.now()
        const updatedProjects: Project[] = [
          {
            ...PROJECTS[0],
            livenessConfig: {
              ...PROJECTS[0].livenessConfig!,
              functionCalls: [
                {
                  ...PROJECTS[0].livenessConfig!.functionCalls[0],
                  untilTimestamp: newUntilTimestamp,
                },
              ],
            },
          },
        ]

        const { livenessIndexer, livenessRepository } = getMockLivenessIndexer({
          projects: updatedProjects,
          configurationRepository,
        })
        await livenessIndexer.start()

        expect(configurationRepository.getAll).toHaveBeenCalledTimes(1)
        expect(
          configurationRepository.setUntilTimestamp,
        ).toHaveBeenNthCalledWith(1, 1, newUntilTimestamp, MOCK_TRX)
        expect(livenessRepository.deleteAfter).toHaveBeenNthCalledWith(
          1,
          1,
          newUntilTimestamp,
          MOCK_TRX,
        )
      })

      it('deletes phasedOut configurations from the DB', async () => {
        const configurationRepository =
          mockObject<LivenessConfigurationRepository>({
            getAll: async () => CONFIGURATIONS,
            addMany: async () => [],
            setLastSyncedTimestamp: async () => -1,
            setUntilTimestamp: async () => -1,
            deleteMany: async () => -1,
          })

        const updatedProjects: Project[] = [
          {
            ...PROJECTS[0],
            livenessConfig: {
              transfers: [],
              functionCalls: [],
            },
          },
        ]

        const { livenessIndexer } = getMockLivenessIndexer({
          projects: updatedProjects,
          configurationRepository,
        })
        await livenessIndexer.start()

        expect(configurationRepository.getAll).toHaveBeenCalledTimes(1)
        expect(configurationRepository.deleteMany).toHaveBeenNthCalledWith(
          1,
          CONFIGURATIONS.map((c) => c.id),
          MOCK_TRX,
        )
      })

      it('does not run if the config hash is the same', async () => {
        const { livenessIndexer, configurationRepository } =
          getMockLivenessIndexer({
            configHash: getLivenessConfigHash(PROJECTS),
          })

        await livenessIndexer.start()

        expect(configurationRepository.getAll).not.toHaveBeenCalled()
      })

      it('runs if the config hash is different', async () => {
        const { livenessIndexer, configurationRepository } =
          getMockLivenessIndexer({
            configHash: hashJson('different-config-hash'),
          })

        await livenessIndexer.start()

        expect(configurationRepository.getAll).toHaveBeenCalled()
      })

      it('runs if the indexer state is undefined', async () => {
        const { livenessIndexer, configurationRepository } =
          getMockLivenessIndexer({
            configHash: undefined,
          })

        await livenessIndexer.start()

        expect(configurationRepository.getAll).toHaveBeenCalled()
      })
    })
  })

  describe(LivenessIndexer.prototype.update.name, () => {
    it('calls getLivenessData and adds results to database, returns "to"', async () => {
      const expectedToSave: LivenessRecord[] = [
        ...TRANSFERS_EXPECTED,
        ...FUNCTIONS_EXPECTED,
      ]

      const adjustedTo = adjustToForBigqueryCall(FROM.toNumber(), TO.toNumber())

      const livenessClient = mockObject<LivenessClient>({
        getLivenessData: mockFn().resolvesTo(expectedToSave),
      })

      const { livenessIndexer, livenessRepository, configurationRepository } =
        getMockLivenessIndexer({ livenessClient })

      const currentTo = await livenessIndexer.update(
        FROM.toNumber(),
        adjustedTo.toNumber(),
      )

      const config = mergeConfigs(
        PROJECTS,
        CONFIGURATIONS.map((c, i) => ({
          ...c,
          id: i,
          lastSyncedTimestamp: undefined,
        })),
      )

      const transfersConfig = config.transfers.filter((c) =>
        isTimestampInRange(
          c.sinceTimestamp,
          c.untilTimestamp,
          c.latestSyncedTimestamp,
          FROM,
          adjustedTo,
        ),
      )
      const functionCallsConfig = config.functionCalls.filter((c) =>
        isTimestampInRange(
          c.sinceTimestamp,
          c.untilTimestamp,
          c.latestSyncedTimestamp,
          FROM,
          adjustedTo,
        ),
      )

      expect(livenessClient.getLivenessData).toHaveBeenNthCalledWith(
        1,
        transfersConfig,
        functionCallsConfig,
        FROM,
        adjustedTo,
      )
      expect(currentTo).toEqual(adjustedTo.toNumber())
      expect(configurationRepository.getAll).toHaveBeenCalledTimes(1)

      CONFIGURATIONS.forEach((c, i) => {
        expect(
          configurationRepository.setLastSyncedTimestamp,
        ).toHaveBeenNthCalledWith(i + 1, i, adjustedTo, MOCK_TRX)
      })

      expect(livenessRepository.addMany).toHaveBeenCalledWith(
        expectedToSave,
        MOCK_TRX,
      )
    })
    it('does not run getLivenessData when configs are empty', async () => {
      const livenessClient = mockObject<LivenessClient>({
        getLivenessData: mockFn().resolvesTo([]),
      })
      const { livenessIndexer } = getMockLivenessIndexer({
        livenessClient,
        projects: [],
      })
      await livenessIndexer.update(FROM.toNumber(), TO.toNumber())
      expect(livenessClient.getLivenessData).not.toHaveBeenCalled()
    })
  })

  describe(LivenessIndexer.prototype.getSafeHeight.name, () => {
    it('should return valid value', async () => {
      const configHash = hashJson('different-config-hash')

      const livenessIndexer = getMockLivenessIndexer({
        configHash,
      }).livenessIndexer
      const safeHeight = await livenessIndexer.getSafeHeight()
      expect(safeHeight).toEqual(1)
    })
  })

  describe(LivenessIndexer.prototype.setSafeHeight.name, () => {
    it('should be called with valid parameters', async () => {
      const mock = getMockLivenessIndexer({})
      const livenessIndexer = mock.livenessIndexer
      const stateRepository = mock.stateRepository
      await livenessIndexer.setSafeHeight(12)

      expect(stateRepository.setSafeHeight).toHaveBeenCalledWith(
        'liveness_indexer',
        12,
      )
    })
  })

  describe(LivenessIndexer.prototype.invalidate.name, () => {
    it('should return its parameter', async () => {
      const mock = getMockLivenessIndexer({})
      const livenessIndexer = mock.livenessIndexer
      const value = await livenessIndexer.invalidate(1)

      expect(value).toEqual(1)
    })
  })

  describe(LivenessIndexer.prototype.getConfiguration.name, () => {
    it('should return configurations and adjustedTo', async () => {
      const { livenessIndexer } = getMockLivenessIndexer({})

      const { functionCallsConfig, transfersConfig, adjustedTo } =
        await livenessIndexer.getConfiguration(FROM.toNumber(), TO.toNumber())

      const expectedTransfersConfig = [
        {
          projectId: PROJECTS[0].projectId,
          from: PROJECTS[0].livenessConfig!.transfers[0].from,
          to: PROJECTS[0].livenessConfig!.transfers[0].to,
          type: LivenessType(PROJECTS[0].livenessConfig!.transfers[0].type),
          sinceTimestamp: CONFIGURATIONS[0].sinceTimestamp,
          untilTimestamp: CONFIGURATIONS[0].untilTimestamp,
          latestSyncedTimestamp: undefined,
          livenessConfigurationId: 0,
        },
      ]
      const expectedFunctionCallsConfig = [
        {
          projectId: PROJECTS[0].projectId,
          address: PROJECTS[0].livenessConfig!.functionCalls[0].address,
          selector: PROJECTS[0].livenessConfig!.functionCalls[0].selector,
          sinceTimestamp: CONFIGURATIONS[1].sinceTimestamp,
          type: LivenessType(PROJECTS[0].livenessConfig!.functionCalls[0].type),
          latestSyncedTimestamp: undefined,
          livenessConfigurationId: 1,
        },
      ]

      expect(transfersConfig).toEqual(expectedTransfersConfig)
      expect(functionCallsConfig).toEqual(expectedFunctionCallsConfig)
      expect(adjustedTo).toEqual(TO)
    })
  })
})
