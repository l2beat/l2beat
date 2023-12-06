import { Logger } from '@l2beat/backend-tools'
import {
  EthereumAddress,
  LivenessType,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { LivenessConfigEntry } from '../../core/liveness/types/LivenessConfig'
import { LivenessId } from '../../core/liveness/types/LivenessId'
import { setupDatabaseTestSuite } from '../../test/database'
import {
  LivenessConfigurationRecord,
  LivenessConfigurationRepository,
} from './LivenessConfigurationRepository'
import { LivenessRepository } from './LivenessRepository'

const START = UnixTime.now()

export const LIVENESS_CONFIGS: LivenessConfigEntry[] = [
  {
    id: LivenessId.random(),
    projectId: ProjectId('project1'),
    type: LivenessType('STATE'),
    formula: 'functionCall',
    address: EthereumAddress.random(),
    selector: '0x',
    sinceTimestamp: START.add(-1, 'hours'),
    untilTimestamp: START.add(-2, 'hours'),
  },
  {
    id: LivenessId.random(),
    projectId: ProjectId('project2'),
    type: LivenessType('DA'),
    formula: 'functionCall',
    address: EthereumAddress.random(),
    selector: '0x',
    sinceTimestamp: START.add(-4, 'hours'),
    untilTimestamp: START.add(-5, 'hours'),
  },
  {
    id: LivenessId.random(),
    projectId: ProjectId('project3'),
    type: LivenessType('STATE'),
    formula: 'functionCall',
    address: EthereumAddress.random(),
    selector: '0x',
    sinceTimestamp: START.add(-7, 'hours'),
    untilTimestamp: START.add(-8, 'hours'),
  },
]

describe(LivenessConfigurationRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new LivenessConfigurationRepository(
    database,
    Logger.SILENT,
  )
  const livenessRepository = new LivenessRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(LivenessConfigurationRepository.prototype.addMany.name, () => {
    it('should add new rows', async () => {
      const newIds = await repository.addMany(LIVENESS_CONFIGS)

      const results = await repository.getAll()

      expect(results).toEqualUnsorted(
        LIVENESS_CONFIGS.map((c, i) => ({
          ...c,
          id: newIds[i],
          lastSyncedTimestamp: undefined,
        })),
      )
    })

    it('empty array', async () => {
      await expect(repository.addMany([])).not.toBeRejected()
    })
  })

  describe(
    LivenessConfigurationRepository.prototype.findUnusedConfigurationsIds.name,
    () => {
      it('should return ids of unused configurations', async () => {
        const newIds = await repository.addMany(LIVENESS_CONFIGS)
        await livenessRepository.addMany([
          {
            timestamp: UnixTime.now(),
            blockNumber: 0,
            txHash: '0x',
            livenessId: newIds[0],
          },
        ])

        const unusedIds = await repository.findUnusedConfigurationsIds()

        expect(unusedIds).toEqualUnsorted(newIds.slice(1))
      })
    },
  )

  describe(
    LivenessConfigurationRepository.prototype.setLastSyncedTimestamp.name,
    () => {
      it('updates last synced timestamp of given configuration', async () => {
        await repository.addMany(LIVENESS_CONFIGS)

        const latest = UnixTime.now()

        await repository.setLastSyncedTimestamp(LIVENESS_CONFIGS[0].id, latest)

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([
          {
            ...LIVENESS_CONFIGS[0],
            debugInfo: expect.a(String),
            lastSyncedTimestamp: latest,
          },
          ...LIVENESS_CONFIGS.slice(1).map((c) => ({
            ...c,
            debugInfo: expect.a(String),
            lastSyncedTimestamp: undefined,
          })),
        ])
      })

      it('does not update if configuration not found', async () => {
        await repository.addMany(LIVENESS_CONFIGS)

        const latest = UnixTime.now()

        await repository.setLastSyncedTimestamp(LivenessId.random(), latest)

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([
          ...LIVENESS_CONFIGS.map((c) => ({
            ...c,
            lastSyncedTimestamp: undefined,
            debugInfo: expect.a(String),
          })),
        ])
      })
    },
  )

  describe(
    LivenessConfigurationRepository.prototype.setUntilTimestamp.name,
    () => {
      it('updates last synced timestamp of given configuration', async () => {
        const newIds = await repository.addMany(LIVENESS_CONFIGS)

        const untilTimestamp = UnixTime.now()
        const updatedRow: LivenessConfigurationRecord = {
          ...LIVENESS_CONFIGS[0],
          id: newIds[0],
          untilTimestamp: untilTimestamp,
          lastSyncedTimestamp: undefined,
        }

        await repository.setUntilTimestamp(newIds[0], untilTimestamp)

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([
          updatedRow,
          ...LIVENESS_CONFIGS.slice(1).map((c, i) => ({
            ...c,
            id: newIds[i + 1],
            lastSyncedTimestamp: undefined,
          })),
        ])
      })

      it('does not update if configuration not found', async () => {
        const newIds = await repository.addMany(LIVENESS_CONFIGS)

        const untilTimestamp = UnixTime.now()

        await repository.setUntilTimestamp(-1, untilTimestamp)

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([
          ...LIVENESS_CONFIGS.map((c, i) => ({
            ...c,
            id: newIds[i],
            lastSyncedTimestamp: undefined,
          })),
        ])
      })
    },
  )

  describe(LivenessConfigurationRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      await repository.addMany(LIVENESS_CONFIGS)

      const results = await repository.getAll()

      expect(results).toEqualUnsorted(
        LIVENESS_CONFIGS.map((c, i) => ({
          ...c,
          lastSyncedTimestamp: undefined,
          debugInfo: expect.a(String),
        })),
      )
    })
  })

  describe(LivenessConfigurationRepository.prototype.deleteMany.name, () => {
    it('should delete rows', async () => {
      const newIds = await repository.addMany(LIVENESS_CONFIGS)
      const all = await repository.getAll()

      await repository.deleteMany(newIds.slice(1))

      const results = await repository.getAll()

      expect(results).toEqualUnsorted([all[0]])
    })

    it('should delete from child tables via CASCADE constraint', async () => {
      const newIds = await repository.addMany(LIVENESS_CONFIGS)

      const childRepository = new LivenessRepository(database, Logger.SILENT)
      await childRepository.deleteAll()
      await childRepository.addMany([
        {
          timestamp: UnixTime.now(),
          blockNumber: 0,
          txHash: '0x',
          livenessId: newIds[1],
        },
      ])

      await repository.deleteMany(newIds.slice(1))
      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        {
          ...LIVENESS_CONFIGS[0],
          lastSyncedTimestamp: undefined,
          debugInfo: expect.a(String),
        },
      ])

      const childResults = await childRepository.getAll()
      expect(childResults).toEqualUnsorted([])
    })

    it('empty array', async () => {
      await expect(repository.deleteMany([])).not.toBeRejected()
    })
  })
})
