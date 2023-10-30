import { Logger } from '@l2beat/backend-tools'
import { LivenessType, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { omit } from 'lodash'

import { setupDatabaseTestSuite } from '../../test/database'
import {
  LivenessConfigurationRecord,
  LivenessConfigurationRepository,
} from './LivenessConfigurationRepository'

const START = UnixTime.now()

export const CONFIG_DATA: Omit<LivenessConfigurationRecord, 'id'>[] = [
  {
    projectId: ProjectId('project1'),
    type: LivenessType('STATE'),
    configHash: 'hash-1',
    configRaw: { key1: 'value1', key2: 'value2' },
    fromTimestamp: START.add(-1, 'hours'),
    toTimestamp: START.add(-2, 'hours'),
    lastSyncedTimestamp: START.add(-3, 'hours'),
  },
  {
    projectId: ProjectId('project2'),
    type: LivenessType('DA'),
    configHash: 'hash-2',
    configRaw: { key1: 'value3', key2: 'value4' },
    fromTimestamp: START.add(-4, 'hours'),
    toTimestamp: START.add(-5, 'hours'),
    lastSyncedTimestamp: START.add(-6, 'hours'),
  },
  {
    projectId: ProjectId('project3'),
    type: LivenessType('STATE'),
    configHash: 'hash-3',
    configRaw: { key1: 'value5', key2: 'value6' },
    fromTimestamp: START.add(-7, 'hours'),
    toTimestamp: START.add(-8, 'hours'),
    lastSyncedTimestamp: START.add(-9, 'hours'),
  },
]

describe(LivenessConfigurationRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new LivenessConfigurationRepository(
    database,
    Logger.SILENT,
  )

  let ids: number[]

  beforeEach(async () => {
    await repository.deleteAll()
    ids = await repository.addMany(CONFIG_DATA)
  })

  describe(LivenessConfigurationRepository.prototype.addMany.name, () => {
    it('should add new rows', async () => {
      const newRow = [
        {
          projectId: ProjectId('project4'),
          type: LivenessType('DA'),
          configHash: 'hash-4',
          configRaw: { key1: 'value7', key2: 'value8' },
          fromTimestamp: START.add(-10, 'hours'),
          toTimestamp: START.add(-11, 'hours'),
          lastSyncedTimestamp: START.add(-12, 'hours'),
        },
      ]
      const newIds = await repository.addMany(newRow)

      const results = await repository.getAll()

      expect(results).toEqualUnsorted([
        ...CONFIG_DATA.map((r, i) => ({ ...r, id: ids[i] })),
        { ...newRow[0], id: newIds[0] },
      ])
    })

    it('empty array', async () => {
      await expect(repository.addMany([])).not.toBeRejected()
    })
  })

  describe(LivenessConfigurationRepository.prototype.updateMany.name, () => {
    it('should update records', async () => {
      const records = await repository.getAll()
      const record = records[0]
      const newRecord = {
        ...record,
        configRaw: { key1: 'value9', key2: 'value10' },
      }
      await repository.updateMany([newRecord])
      const results = await repository.getAll()
      expect(results).toEqualUnsorted([newRecord, ...records.slice(1)])
    })

    it('empty array', async () => {
      await expect(repository.updateMany([])).not.toBeRejected()
    })
  })

  describe(LivenessConfigurationRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      const results = await repository.getAll()

      expect(results).toEqualUnsorted([
        ...CONFIG_DATA.map((r, i) => ({ ...r, id: ids[i] })),
      ])
    })
  })

  describe(
    LivenessConfigurationRepository.prototype.getByConfigHash.name,
    () => {
      it('should return record by config hash', async () => {
        const result = await repository.getByConfigHash(
          CONFIG_DATA[0].configHash,
        )
        const record = omit(result[0], 'id')

        expect(record).toEqual(CONFIG_DATA[0])
      })
    },
  )
})
