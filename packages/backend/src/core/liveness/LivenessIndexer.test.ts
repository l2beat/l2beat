import { hashJson, UnixTime } from '@l2beat/shared-pure'
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
import { getLivenessConfigHash } from './utils'

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
          minTimestamp,
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
            updateMany: async () => [],
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
            updateMany: async () => [],
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
        expect(configurationRepository.updateMany).toHaveBeenNthCalledWith(
          1,
          CONFIGURATIONS.slice(1).map((c) => ({
            id: 1,
            identifier: c.identifier,
            type: c.type,
            params: c.params,
            sinceTimestamp: c.sinceTimestamp,
            untilTimestamp: newUntilTimestamp,
            projectId: c.projectId,
            lastSyncedTimestamp: undefined,
          })),
          MOCK_TRX,
        )
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
            updateMany: async () => [],
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
      const livenessClient = mockObject<LivenessClient>({
        getLivenessData: mockFn().resolvesTo({
          data: expectedToSave,
          to: TO,
        }),
      })

      const { livenessIndexer, livenessRepository, configurationRepository } =
        getMockLivenessIndexer({ livenessClient })

      const currentTo = await livenessIndexer.update(
        FROM.toNumber(),
        TO.toNumber(),
      )

      expect(livenessClient.getLivenessData).toHaveBeenCalledWith(
        PROJECTS,
        CONFIGURATIONS.map((c, i) => ({
          ...c,
          id: i,
          lastSyncedTimestamp: undefined,
        })),
        FROM,
        TO,
      )
      expect(currentTo).toEqual(TO.toNumber())
      expect(configurationRepository.getAll).toHaveBeenCalledTimes(1)
      expect(configurationRepository.updateMany).toHaveBeenNthCalledWith(
        1,
        CONFIGURATIONS.map((c, i) => ({
          ...c,
          id: i,
          lastSyncedTimestamp: TO,
        })),
        MOCK_TRX,
      )
      expect(livenessRepository.addMany).toHaveBeenCalledWith(
        expectedToSave,
        MOCK_TRX,
      )
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

      expect(stateRepository.add).toHaveBeenCalledWith({
        safeHeight: 12,
        indexerId: 'liveness_indexer',
        configHash: mock.indexerConfigHash,
      })
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
})
