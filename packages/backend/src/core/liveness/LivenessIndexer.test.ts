import { hashJson } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { Project } from '../../model'
import { LIVENESS_CONFIGS } from '../../peripherals/database/LivenessConfigurationRepository.test'
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
  TRANSFERS_EXPECTED,
  FUNCTIONS_EXPECTED,
} = LIVENESS_MOCK

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

      const { livenessIndexer, wrappedLogger } = getMockLivenessIndexer(
        PROJECTS,
        undefined,
        livenessClient,
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

      const { livenessIndexer, livenessRepository } = getMockLivenessIndexer(
        PROJECTS,
        undefined,
        livenessClient,
      )

      const currentTo = await livenessIndexer.update(
        FROM.toNumber(),
        TO.toNumber(),
      )

      expect(livenessClient.getLivenessData).toHaveBeenCalledWith(
        PROJECTS,
        LIVENESS_CONFIGS.map((c, i) => ({
          ...c,
          id: i,
          lastSyncedTimestamp: undefined,
        })),
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
