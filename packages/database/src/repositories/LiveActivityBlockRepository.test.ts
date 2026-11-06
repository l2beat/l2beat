import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type LiveActivityBlockRecord,
  LiveActivityBlockRepository,
} from './LiveActivityBlockRepository'

describeDatabase(LiveActivityBlockRepository.name, (db) => {
  const repository = db.liveActivityBlock
  const START = UnixTime.toStartOf(UnixTime.now(), 'hour')

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(LiveActivityBlockRepository.prototype.upsertMany.name, () => {
    it('replaces a block fetched again after a reorg', async () => {
      await repository.upsertMany([block('a', 1), block('a', 2)])
      const replaced = { ...block('a', 2), hash: '0xother', count: 7 }

      await repository.upsertMany([replaced])

      expect(await repository.getNewest(ProjectId('a'), 10)).toEqual([
        block('a', 1),
        replaced,
      ])
    })

    it('keeps gas above the 32-bit range', async () => {
      const heavy = { ...block('a', 1), gasUsed: 30_000_000_000 }

      await repository.upsertMany([heavy])

      expect(await repository.getNewest(ProjectId('a'), 1)).toEqual([heavy])
    })
  })

  describe(LiveActivityBlockRepository.prototype.getNewest.name, () => {
    it("returns the project's newest blocks, oldest first", async () => {
      await repository.upsertMany([
        block('a', 1),
        block('a', 2),
        block('a', 3),
        block('b', 4),
      ])

      expect(await repository.getNewest(ProjectId('a'), 2)).toEqual([
        block('a', 2),
        block('a', 3),
      ])
    })
  })

  describe(
    LiveActivityBlockRepository.prototype.getByProjectNumberRange.name,
    () => {
      it("returns the project's blocks in the range, both ends included", async () => {
        await repository.upsertMany([
          block('a', 1),
          block('a', 2),
          block('a', 4),
          block('a', 5),
          block('b', 3),
        ])

        expect(
          await repository.getByProjectNumberRange(ProjectId('a'), 2, 4),
        ).toEqual([block('a', 2), block('a', 4)])
      })
    },
  )

  describe(LiveActivityBlockRepository.prototype.getProjectBuckets.name, () => {
    it("sums the project's blocks in the range per bucket", async () => {
      const minute = UnixTime.toStartOf(START, 'hour')
      await repository.upsertMany([
        { ...block('a', 1), timestamp: minute + 5 },
        { ...block('a', 2), timestamp: minute + 50, uopsCount: null },
        { ...block('a', 3), timestamp: minute + 70 },
        { ...block('a', 4), timestamp: minute + 200 },
        { ...block('b', 5), timestamp: minute + 10 },
      ])

      expect(
        await repository.getProjectBuckets(
          ProjectId('a'),
          minute,
          minute + 120,
          60,
        ),
      ).toEqual([
        {
          timestamp: minute,
          blocks: 2,
          count: 30,
          uopsCount: 31,
          gasUsed: 3_000_000,
        },
        {
          timestamp: minute + 60,
          blocks: 1,
          count: 30,
          uopsCount: 33,
          gasUsed: 3_000_000,
        },
      ])
    })
  })

  describe(LiveActivityBlockRepository.prototype.getHoursAfter.name, () => {
    it("sums the project's blocks above the number per hour", async () => {
      const hour = UnixTime.toStartOf(START, 'hour')
      await repository.upsertMany([
        { ...block('a', 1), timestamp: hour + 10 },
        { ...block('a', 2), timestamp: hour + 20 },
        { ...block('a', 3), timestamp: hour + 30, uopsCount: null },
        { ...block('a', 4), timestamp: hour + UnixTime.HOUR + 5 },
        { ...block('b', 5), timestamp: hour + 40 },
      ])

      expect(await repository.getHoursAfter(ProjectId('a'), 1)).toEqual([
        {
          timestamp: hour,
          blocks: 2,
          count: 50,
          // Block 3 counts no user operations, so its transactions stand in
          uopsCount: 52,
          firstNumber: 2,
          lastNumber: 3,
          lastTimestamp: hour + 30,
        },
        {
          timestamp: hour + UnixTime.HOUR,
          blocks: 1,
          count: 40,
          uopsCount: 44,
          firstNumber: 4,
          lastNumber: 4,
          lastTimestamp: hour + UnixTime.HOUR + 5,
        },
      ])
    })
  })

  describe(
    LiveActivityBlockRepository.prototype.deleteByProjectAfter.name,
    () => {
      it("deletes the project's blocks above the number", async () => {
        await repository.upsertMany([
          block('a', 1),
          block('a', 2),
          block('a', 3),
          block('b', 3),
        ])

        const deleted = await repository.deleteByProjectAfter(ProjectId('a'), 1)

        expect(deleted).toEqual(2)
        expect(await repository.getNewest(ProjectId('a'), 10)).toEqual([
          block('a', 1),
        ])
        expect(await repository.getNewest(ProjectId('b'), 10)).toEqual([
          block('b', 3),
        ])
      })
    },
  )

  describe(LiveActivityBlockRepository.prototype.deleteByProject.name, () => {
    it("deletes only the project's blocks", async () => {
      await repository.upsertMany([block('a', 1), block('b', 1)])

      await repository.deleteByProject(ProjectId('a'))

      expect(await repository.getNewest(ProjectId('a'), 10)).toEqual([])
      expect(await repository.getNewest(ProjectId('b'), 10)).toEqual([
        block('b', 1),
      ])
    })
  })

  describe(LiveActivityBlockRepository.prototype.deleteBefore.name, () => {
    it("deletes every project's blocks before the timestamp", async () => {
      await repository.upsertMany([
        block('a', 1),
        block('a', 2),
        block('b', 1),
        block('b', 3),
      ])

      const deleted = await repository.deleteBefore(block('a', 2).timestamp)

      expect(deleted).toEqual(2)
      expect(await repository.getNewest(ProjectId('a'), 10)).toEqual([
        block('a', 2),
      ])
      expect(await repository.getNewest(ProjectId('b'), 10)).toEqual([
        block('b', 3),
      ])
    })
  })

  function block(projectId: string, number: number): LiveActivityBlockRecord {
    return {
      projectId: ProjectId(projectId),
      number,
      hash: `0x${number}`,
      parentHash: `0x${number - 1}`,
      timestamp: START + number * 12,
      count: number * 10,
      uopsCount: number * 11,
      gasUsed: number * 1_000_000,
    }
  }
})
