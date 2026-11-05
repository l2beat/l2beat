import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type HourlyActivityRecord,
  HourlyActivityRepository,
} from './HourlyActivityRepository'

describeDatabase(HourlyActivityRepository.name, (db) => {
  const repository = db.hourlyActivity

  const START = UnixTime.toStartOf(UnixTime.now(), 'hour')
  const HOUR = UnixTime.HOUR

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(HourlyActivityRepository.prototype.addMany.name, () => {
    it('adds the counts to stored hours', async () => {
      await repository.addMany([record('a', START, 10, 12)])

      await repository.addMany([
        record('a', START, 5, 6),
        record('a', START + HOUR, 3, 3),
      ])

      expect(
        await repository.getByProjectsAndTimeRange(
          [ProjectId('a')],
          [START, START + HOUR],
        ),
      ).toEqual([record('a', START, 15, 18), record('a', START + HOUR, 3, 3)])
    })

    it('keeps uops empty for a chain without them', async () => {
      await repository.addMany([record('a', START, 10, null)])

      await repository.addMany([record('a', START, 5, null)])

      expect(
        await repository.getByProjectsAndTimeRange(
          [ProjectId('a')],
          [START, START],
        ),
      ).toEqual([record('a', START, 15, null)])
    })
  })

  describe(
    HourlyActivityRepository.prototype.getByProjectsAndTimeRange.name,
    () => {
      it("returns the projects' hours within the range by time, both ends included", async () => {
        await repository.addMany([
          record('a', START, 1, 1),
          record('a', START + 1 * HOUR, 2, 2),
          record('b', START + 1 * HOUR, 5, 5),
          record('a', START + 2 * HOUR, 3, 3),
          record('c', START + 2 * HOUR, 6, 6),
          record('a', START + 3 * HOUR, 4, 4),
        ])

        const results = await repository.getByProjectsAndTimeRange(
          [ProjectId('a'), ProjectId('b')],
          [START + 1 * HOUR, START + 2 * HOUR],
        )

        expect(results).toEqualUnsorted([
          record('a', START + 1 * HOUR, 2, 2),
          record('b', START + 1 * HOUR, 5, 5),
          record('a', START + 2 * HOUR, 3, 3),
        ])
        expect(results.map((r) => r.timestamp)).toEqual([
          START + 1 * HOUR,
          START + 1 * HOUR,
          START + 2 * HOUR,
        ])
      })

      it('returns nothing for no projects', async () => {
        await repository.addMany([record('a', START, 1, 1)])

        expect(
          await repository.getByProjectsAndTimeRange([], [START, START]),
        ).toEqual([])
      })
    },
  )

  describe(HourlyActivityRepository.prototype.getFirstTimestamp.name, () => {
    it("returns the project's first hour, or nothing without hours", async () => {
      await repository.addMany([
        record('a', START + HOUR, 2, 2),
        record('a', START, 1, 1),
        record('b', START - HOUR, 3, 3),
      ])

      expect(await repository.getFirstTimestamp(ProjectId('a'))).toEqual(START)
      expect(await repository.getFirstTimestamp(ProjectId('c'))).toEqual(
        undefined,
      )
    })
  })

  describe(
    HourlyActivityRepository.prototype.deleteByProjectIdFrom.name,
    () => {
      it("deletes the project's hours from the timestamp on", async () => {
        await repository.addMany([
          record('a', START, 1, 1),
          record('a', START + 1 * HOUR, 2, 2),
          record('a', START + 2 * HOUR, 3, 3),
          record('b', START + 2 * HOUR, 4, 4),
        ])

        const deleted = await repository.deleteByProjectIdFrom(
          ProjectId('a'),
          START + 1 * HOUR,
        )

        expect(deleted).toEqual(2)
        expect(await hoursOf('a')).toEqual([record('a', START, 1, 1)])
        expect(await hoursOf('b')).toEqual([
          record('b', START + 2 * HOUR, 4, 4),
        ])
      })
    },
  )

  describe(
    HourlyActivityRepository.prototype.deleteByProjectIdUntil.name,
    () => {
      it("deletes the project's hours before the timestamp", async () => {
        await repository.addMany([
          record('a', START, 1, 1),
          record('a', START + 1 * HOUR, 2, 2),
          record('a', START + 2 * HOUR, 3, 3),
          record('b', START, 4, 4),
        ])

        const deleted = await repository.deleteByProjectIdUntil(
          ProjectId('a'),
          START + 2 * HOUR,
        )

        expect(deleted).toEqual(2)
        expect(await hoursOf('a')).toEqual([
          record('a', START + 2 * HOUR, 3, 3),
        ])
        expect(await hoursOf('b')).toEqual([record('b', START, 4, 4)])
      })
    },
  )

  describe(HourlyActivityRepository.prototype.getLatestHours.name, () => {
    const LATEST = START + 25 * HOUR + 1234

    afterEach(async () => {
      await db.syncMetadata.deleteAll()
      await db.activityHeadBlock.deleteAll()
    })

    it('reads the full hours before the latest block and its partial hour', async () => {
      await setLatestBlockTimestamp('a', LATEST)
      await repository.addMany([
        record('a', START + 1 * HOUR, 1, 1),
        record('a', START + 2 * HOUR, 2, 2),
        record('a', START + 24 * HOUR, 3, 3),
        record('a', START + 25 * HOUR, 4, null),
        // Not counted yet, as after the latest block
        record('a', START + 26 * HOUR, 5, 5),
        record('b', START + 25 * HOUR, 6, 6),
      ])

      const result = await repository.getLatestHours(ProjectId('a'), 23)

      expect(result).toEqual({
        latestBlockTimestamp: LATEST,
        records: [
          record('a', START + 2 * HOUR, 2, 2),
          record('a', START + 24 * HOUR, 3, 3),
          record('a', START + 25 * HOUR, 4, null),
        ],
      })
    })

    it('reads no hours when there are none', async () => {
      await setLatestBlockTimestamp('a', LATEST)

      const result = await repository.getLatestHours(ProjectId('a'), 23)

      expect(result).toEqual({ latestBlockTimestamp: LATEST, records: [] })
    })

    it('reads nothing without a latest block', async () => {
      await db.syncMetadata.upsertMany([
        { ...syncMetadata('a'), latestBlockTimestamp: null },
      ])
      await repository.addMany([record('a', START, 1, 1)])

      const result = await repository.getLatestHours(ProjectId('a'), 23)

      expect(result).toEqual(undefined)
    })

    it('adds the head blocks above the counted ones to their hours', async () => {
      // Methodology: the counts reach block 100 at LATEST, in hour START+25h.
      // Head blocks 99 and 100 are counted already, 101 joins that hour and
      // 102 starts the next one, which then is the hour so far
      await setLatestBlockTimestamp('a', LATEST)
      await repository.addMany([
        record('a', START + 24 * HOUR, 3, 3),
        record('a', START + 25 * HOUR, 4, 4),
      ])
      const head = START + 26 * HOUR + 30
      await db.activityHeadBlock.replaceForProject(ProjectId('a'), [
        headBlock(99, LATEST - 12, 1000),
        headBlock(100, LATEST, 1000),
        headBlock(101, LATEST + 12, 10),
        headBlock(102, head, 20),
      ])

      const result = await repository.getLatestHours(ProjectId('a'), 1)

      expect(result).toEqual({
        latestBlockTimestamp: head,
        records: [
          record('a', START + 25 * HOUR, 14, 14),
          record('a', START + 26 * HOUR, 20, 20),
        ],
      })
    })

    it('ignores head blocks that do not run on from the counted ones', async () => {
      // As after an invalidation: counts restarted at block 100, head blocks
      // still from before it start at 103, so 101 and 102 would be missing
      await setLatestBlockTimestamp('a', LATEST)
      await repository.addMany([record('a', START + 25 * HOUR, 4, 4)])
      await db.activityHeadBlock.replaceForProject(ProjectId('a'), [
        headBlock(103, LATEST + 36, 10),
        headBlock(104, LATEST + 48, 10),
      ])

      const result = await repository.getLatestHours(ProjectId('a'), 1)

      expect(result).toEqual({
        latestBlockTimestamp: LATEST,
        records: [record('a', START + 25 * HOUR, 4, 4)],
      })
    })

    it('reads no head blocks without a latest counted block', async () => {
      await db.syncMetadata.upsertMany([
        { ...syncMetadata('a'), latestBlockTimestamp: null },
      ])
      await db.activityHeadBlock.replaceForProject(ProjectId('a'), [
        headBlock(101, LATEST, 10),
      ])

      const result = await repository.getLatestHours(ProjectId('a'), 23)

      expect(result).toEqual(undefined)
    })

    function headBlock(number: number, timestamp: UnixTime, count: number) {
      return { number, timestamp, count, uopsCount: count }
    }

    async function setLatestBlockTimestamp(id: string, timestamp: UnixTime) {
      await db.syncMetadata.upsertMany([
        { ...syncMetadata(id), latestBlockTimestamp: timestamp },
      ])
    }

    function syncMetadata(id: string) {
      return {
        feature: 'activity' as const,
        id,
        target: START,
        syncedUntil: START,
        blockTarget: 100,
        blockSyncedUntil: 100,
      }
    }
  })

  function hoursOf(projectId: string) {
    return repository.getByProjectsAndTimeRange(
      [ProjectId(projectId)],
      [START, START + 3 * HOUR],
    )
  }
})

function record(
  projectId: string,
  timestamp: UnixTime,
  count: number,
  uopsCount: number | null,
): HourlyActivityRecord {
  return { projectId: ProjectId(projectId), timestamp, count, uopsCount }
}
