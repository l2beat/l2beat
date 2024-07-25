import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { ActivityRecord } from './entity'
import { ActivityRepository } from './repository'

describeDatabase(ActivityRepository.name, (db) => {
  const repository = db.activity

  const START = UnixTime.now()

  describe(ActivityRepository.prototype.upsertMany.name, () => {
    it('adds new rows', async () => {
      await repository.upsertMany([
        count('a', START, 1),
        count('a', START.add(1, 'days'), 2),
        count('a', START.add(2, 'days'), 4),
      ])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        count('a', START, 1),
        count('a', START.add(1, 'days'), 2),
        count('a', START.add(2, 'days'), 4),
      ])
    })

    it('merges on conflict', async () => {
      await repository.upsertMany([
        count('a', START, 1),
        count('a', START.add(1, 'days'), 2),
      ])
      await repository.upsertMany([count('a', START, 3)])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        count('a', START, 3),
        count('a', START.add(1, 'days'), 2),
      ])
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
    it('should delete all rows after a given timestamp and projectId', async () => {
      await repository.upsertMany([
        count('a', START, 1),
        count('a', START.add(1, 'days'), 2),
        count('a', START.add(2, 'days'), 4),
        count('a', START.add(3, 'days'), 2),
      ])

      await repository.deleteAfter(START.add(1, 'days'), ProjectId('a'))

      const results = await repository.getAll()

      expect(results).toEqualUnsorted([
        count('a', START, 1),
        count('a', START.add(1, 'days'), 2),
      ])
    })
  })

  describe(ActivityRepository.prototype.getByProjectAndTimeRange.name, () => {
    it('should return all rows in a given time range', async () => {
      await repository.upsertMany([
        count('a', START, 1),
        count('a', START.add(1, 'days'), 2),
        count('a', START.add(2, 'days'), 4),
      ])

      const results = await repository.getByProjectAndTimeRange(
        ProjectId('a'),
        [START, START.add(1, 'days')],
      )

      expect(results).toEqual([
        count('a', START, 1),
        count('a', START.add(1, 'days'), 2),
      ])
    })
  })

  afterEach(async function () {
    await repository.deleteAll()
  })
})

function count(
  projectId: string,
  timestamp: UnixTime,
  count: number,
): ActivityRecord {
  return {
    projectId: ProjectId(projectId),
    timestamp,
    count,
  }
}
