import { Logger } from '@l2beat/backend-tools'
import {
  EthereumAddress,
  LivenessType,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import {
  LivenessConfigEntry,
  makeLivenessFunctionCall,
} from '../../core/liveness/types/LivenessConfig'
import { LivenessId } from '../../core/liveness/types/LivenessId'
import { setupDatabaseTestSuite } from '../../test/database'
import {
  LivenessConfigurationRecord,
  LivenessConfigurationRepository,
} from './LivenessConfigurationRepository'
import { LivenessRepository } from './LivenessRepository'

const START = UnixTime.now()

export const LIVENESS_CONFIGS: LivenessConfigEntry[] = [
  makeLivenessFunctionCall({
    projectId: ProjectId('project1'),
    type: LivenessType('STATE'),
    formula: 'functionCall',
    address: EthereumAddress.random(),
    selector: '0x',
    sinceTimestamp: START,
    untilTimestamp: START.add(1, 'hours'),
  }),
  makeLivenessFunctionCall({
    projectId: ProjectId('project2'),
    type: LivenessType('DA'),
    formula: 'functionCall',
    address: EthereumAddress.random(),
    selector: '0x',
    sinceTimestamp: START,
    untilTimestamp: START.add(1, 'hours'),
  }),
  makeLivenessFunctionCall({
    projectId: ProjectId('project3'),
    type: LivenessType('PROOF'),
    formula: 'functionCall',
    address: EthereumAddress.random(),
    selector: '0x',
    sinceTimestamp: START,
    untilTimestamp: START.add(1, 'hours'),
  }),
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
      await repository.addMany(LIVENESS_CONFIGS)
      const results = await repository.getAll()

      expect(results).toEqualUnsorted(LIVENESS_CONFIGS.map(toRecord))
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

        await repository.setLastSyncedTimestamp(
          [LIVENESS_CONFIGS[0].id, LIVENESS_CONFIGS[1].id],
          latest,
        )

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([
          {
            ...toRecord(LIVENESS_CONFIGS[0]),
            lastSyncedTimestamp: latest,
          },
          {
            ...toRecord(LIVENESS_CONFIGS[1]),
            lastSyncedTimestamp: latest,
          },
          ...LIVENESS_CONFIGS.slice(2).map(toRecord),
        ])
      })

      it('does not update if configuration not found', async () => {
        await repository.addMany(LIVENESS_CONFIGS)

        const latest = UnixTime.now()

        await repository.setLastSyncedTimestamp([LivenessId.random()], latest)

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([...LIVENESS_CONFIGS.map(toRecord)])
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
          ...toRecord(LIVENESS_CONFIGS[0]),
          untilTimestamp: untilTimestamp,
        }

        await repository.setUntilTimestamp(newIds[0], untilTimestamp)

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([
          updatedRow,
          ...LIVENESS_CONFIGS.slice(1).map(toRecord),
        ])
      })

      it('does not update if configuration not found', async () => {
        await repository.addMany(LIVENESS_CONFIGS)

        const untilTimestamp = UnixTime.now()

        await repository.setUntilTimestamp(LivenessId.random(), untilTimestamp)

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([...LIVENESS_CONFIGS.map(toRecord)])
      })
    },
  )

  describe(LivenessConfigurationRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      await repository.addMany(LIVENESS_CONFIGS)

      const results = await repository.getAll()

      expect(results).toEqualUnsorted(LIVENESS_CONFIGS.map(toRecord))
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
      expect(results).toEqualUnsorted([toRecord(LIVENESS_CONFIGS[0])])

      const childResults = await childRepository.getAll()
      expect(childResults).toEqualUnsorted([])
    })

    it('empty array', async () => {
      await expect(repository.deleteMany([])).not.toBeRejected()
    })
  })
})
function toRecord(entry: LivenessConfigEntry): LivenessConfigurationRecord {
  return {
    id: entry.id,
    projectId: entry.projectId,
    type: entry.type,
    sinceTimestamp: entry.sinceTimestamp,
    untilTimestamp: entry.untilTimestamp,
    lastSyncedTimestamp: undefined,
    debugInfo: expect.a(String),
  }
}
