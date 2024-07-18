import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../test/database'
import { ActivityRecord } from './entity'
import { ActivityRepository } from './repository'

describeDatabase(ActivityRepository.name, (db) => {
  const repository = db.activity

  const START = UnixTime.now()

  const DATA: ActivityRecord[] = [
    {
      projectId: ProjectId('project-a'),
      timestamp: START,
      count: 1,
    },
    {
      projectId: ProjectId('project-a'),
      timestamp: START.add(1, 'days'),
      count: 2,
    },
    {
      projectId: ProjectId('project-a'),
      timestamp: START.add(2, 'days'),
      count: 4,
    },
    {
      projectId: ProjectId('project-a'),
      timestamp: START.add(3, 'days'),
      count: 2,
    },
  ]

  beforeEach(async function () {
    this.timeout(10000)
    await repository.deleteAll()
    await repository.addOrUpdateMany(DATA)
  })

  describe(ActivityRepository.prototype.addOrUpdateMany.name, () => {
    it('adds new row', async () => {
      const newRecord: ActivityRecord = {
        projectId: ProjectId('project-c'),
        timestamp: UnixTime.fromDate(new Date('2021-01-01T03:00:00Z')),
        count: 1,
      }

      await repository.addOrUpdateMany([newRecord])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([...DATA, newRecord])
    })

    it('merges on conflict', async () => {
      const mockRecord: ActivityRecord = {
        projectId: ProjectId('project-a'),
        timestamp: START,
        count: 3,
      }

      await repository.addOrUpdateMany([mockRecord])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([mockRecord, ...DATA.slice(1)])
    })
  })

  describe(ActivityRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toEqual([])
    })
  })

  describe(ActivityRepository.prototype.deleteAfter.name, () => {
    it('should delete all rows after a given timestamp', async () => {
      await repository.deleteAfter(START.add(1, 'days'))

      const results = await repository.getAll()

      expect(results).toEqualUnsorted(DATA.slice(0, 2))
    })
  })

  describe(ActivityRepository.prototype.getByProjectAndTimeRange.name, () => {
    it('should return all rows in a given time range', async () => {
      const results = await repository.getByProjectAndTimeRange(
        ProjectId('project-a'),
        [START, START.add(2, 'days')],
      )

      expect(results).toEqual(DATA.slice(0, 3))
    })
  })
})
