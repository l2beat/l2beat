import { Logger } from '@l2beat/backend-tools'
import { LivenessType, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../test/database'
import { LivenessRecord, LivenessRepository } from './LivenessRepository'

describe(LivenessRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new LivenessRepository(database, Logger.SILENT)

  const START = UnixTime.now()
  const DATA = [
    {
      projectId: ProjectId('project1'),
      timestamp: START.add(-1, 'hours'),
      blockNumber: 12345,
      txHash: '0x1234567890abcdef',
      type: LivenessType('DA'),
    },
    {
      projectId: ProjectId('project2'),
      timestamp: START.add(-2, 'hours'),
      blockNumber: 12346,
      txHash: '0xabcdef1234567890',
      type: LivenessType('STATE'),
    },
    {
      projectId: ProjectId('project3'),
      timestamp: START.add(-3, 'hours'),
      blockNumber: 12347,
      txHash: '0x12345678901abcdef',
      type: LivenessType('STATE'),
    },
    {
      projectId: ProjectId('project4'),
      timestamp: START.add(-4, 'hours'),
      blockNumber: 12348,
      txHash: '0xabcdef1234567891',
      type: LivenessType('DA'),
    },
  ]

  beforeEach(async () => {
    await repository.deleteAll()
    await repository.addMany(DATA)
  })

  describe(LivenessRepository.prototype.addMany.name, () => {
    it('only new rows', async () => {
      const newRows = [
        {
          projectId: ProjectId('project5'),
          timestamp: START.add(-5, 'hours'),
          blockNumber: 12349,
          txHash: '0x1234567890abcdef1',
          type: LivenessType('DA'),
        },
        {
          projectId: ProjectId('project6'),
          timestamp: START.add(-6, 'hours'),
          blockNumber: 12350,
          txHash: '0xabcdef1234567892',
          type: LivenessType('STATE'),
        },
      ]
      await repository.addMany(newRows)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([...DATA, ...newRows])
    })

    it('empty array', async () => {
      await expect(repository.addMany([])).not.toBeRejected()
    })

    it('big query', async () => {
      const records: LivenessRecord[] = []
      for (let i = 5; i < 15_000; i++) {
        records.push({
          projectId: ProjectId(`project${i}`),
          timestamp: START.add(-i, 'hours'),
          blockNumber: i,
          txHash: `0xabcdef1234567892${i}`,
          type: LivenessType(i % 2 === 0 ? 'STATE' : 'DA'),
        })
      }
      await expect(repository.addMany(records)).not.toBeRejected()
    })
  })

  describe(LivenessRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      const results = await repository.getAll()

      expect(results).toEqualUnsorted(DATA)
    })
  })

  describe(LivenessRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toEqual([])
    })
  })
})
