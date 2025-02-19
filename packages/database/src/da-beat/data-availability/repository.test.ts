import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import type { DataAvailabilityRecord } from './entity'
import { DataAvailabilityRepository } from './repository'

describeDatabase(DataAvailabilityRepository.name, (db) => {
  const repository = db.dataAvailability

  const START = UnixTime.now()

  describe(DataAvailabilityRepository.prototype.upsertMany.name, () => {
    it('adds new rows', async () => {
      await repository.upsertMany([
        record('project-a', 'layer-a', START, 100n),
        record('project-b', 'layer-a', START, 200n),
        record('project-c', 'layer-b', START, 300n),
        record('project-c', 'layer-b', START.add(1, 'days'), 400n),
      ])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        record('project-a', 'layer-a', START, 100n),
        record('project-b', 'layer-a', START, 200n),
        record('project-c', 'layer-b', START, 300n),
        record('project-c', 'layer-b', START.add(1, 'days'), 400n),
      ])
    })

    it('merges on conflict', async () => {
      await repository.upsertMany([
        record('project-a', 'layer-a', START, 100n),
        record('project-b', 'layer-a', START, 200n),
        record('project-c', 'layer-b', START, 300n),
      ])
      await repository.upsertMany([
        record('project-a', 'layer-a', START, 1_000n),
        record('project-b', 'layer-a', START, 2_000n),
      ])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        record('project-a', 'layer-a', START, 1_000n),
        record('project-b', 'layer-a', START, 2_000n),
        record('project-c', 'layer-b', START, 300n),
      ])
    })

    it('returns number of processed records', async () => {
      const records = [
        record('project-a', 'layer-a', START, 100n),
        record('project-b', 'layer-a', START, 200n),
      ]
      const result = await repository.upsertMany(records)
      expect(result).toEqual(2)
    })

    it('returns 0 for empty array', async () => {
      const result = await repository.upsertMany([])
      expect(result).toEqual(0)
    })
  })

  describe(DataAvailabilityRepository.prototype.getForDaLayerInTimeRange
    .name, () => {
    it('returns records for a DA layer within time range', async () => {
      await repository.upsertMany([
        record('project-a', 'layer-a', START, 100n),
        record('project-a', 'layer-a', START.add(1, 'days'), 200n),
        record('project-a', 'layer-a', START.add(2, 'days'), 300n),
        record('project-a', 'layer-a', START.add(3, 'days'), 400n),
      ])

      const results = await repository.getForDaLayerInTimeRange(
        'layer-a',
        START,
        START.add(2, 'days'),
      )

      expect(results).toEqualUnsorted([
        record('project-a', 'layer-a', START, 100n),
        record('project-a', 'layer-a', START.add(1, 'days'), 200n),
        record('project-a', 'layer-a', START.add(2, 'days'), 300n),
      ])
    })

    it('returns empty array when no records exist for DA layer', async () => {
      await repository.upsertMany([
        record('project-a', 'layer-a', START, 100n),
        record('project-b', 'layer-b', START, 100n),
      ])

      const results = await repository.getForDaLayerInTimeRange(
        'layer-c',
        START,
        START.add(1, 'days'),
      )

      expect(results).toEqual([])
    })

    it('returns empty array when no records exist in time range', async () => {
      await repository.upsertMany([
        record('project-1', 'layer-1', START, 100n),
        record('project-a', 'layer-a', START.add(1, 'days'), 200n),
      ])

      const results = await repository.getForDaLayerInTimeRange(
        'ethereum',
        START.add(2, 'days'),
        START.add(3, 'days'),
      )

      expect(results).toEqual([])
    })

    it('handles empty database', async () => {
      const results = await repository.getForDaLayerInTimeRange(
        'ethereum',
        START,
        START.add(1, 'days'),
      )

      expect(results).toEqual([])
    })
  })

  describe(DataAvailabilityRepository.prototype.getByProjectIdsAndTimeRange
    .name, () => {
    it('should return records for projects in given time range', async () => {
      await repository.upsertMany([
        record('project-a', 'layer-a', START, 100n),
        record('project-a', 'layer-a', START.add(1, 'days'), 1_000n),
        record('project-a', 'layer-a', START.add(2, 'days'), 10_000n),
        record('project-b', 'layer-a', START, 200n),
        record('project-b', 'layer-a', START.add(1, 'days'), 2_000n),
        record('project-c', 'layer-a', START, 300n),
      ])

      const results = await repository.getByProjectIdsAndTimeRange(
        ['project-a', 'project-b'],
        [START, START.add(1, 'days')],
      )

      expect(results).toEqualUnsorted([
        record('project-a', 'layer-a', START, 100n),
        record('project-a', 'layer-a', START.add(1, 'days'), 1_000n),
        record('project-b', 'layer-a', START, 200n),
        record('project-b', 'layer-a', START.add(1, 'days'), 2_000n),
      ])
    })

    it('allows to query for null from', async () => {
      await repository.upsertMany([
        record('project-a', 'layer-a', START, 100n),
        record('project-a', 'layer-a', START.add(1, 'days'), 1_000n),
        record('project-a', 'layer-a', START.add(2, 'days'), 1_000n),
      ])

      const results = await repository.getByProjectIdsAndTimeRange(
        ['project-a', 'project-b'],
        [null, START.add(1, 'days')],
      )

      expect(results).toEqualUnsorted([
        record('project-a', 'layer-a', START, 100n),
        record('project-a', 'layer-a', START.add(1, 'days'), 1_000n),
      ])
    })
  })

  describe(DataAvailabilityRepository.prototype
    .getLargestPosterByProjectIdsAndTimestamp.name, () => {
    it('should return the largest poster at a given timestamp', async () => {
      await repository.upsertMany([
        record('project-a', 'layer-a', START, 100n),
        record('project-a', 'layer-a', START.add(1, 'days'), 1_000n),
        record('project-b', 'layer-a', START, 200n),
        record('project-b', 'layer-a', START.add(1, 'days'), 2_000n),
        record('project-c', 'layer-a', START, 300n),
      ])

      const results = await repository.getLargestPosterByProjectIdsAndTimestamp(
        ['project-a', 'project-b'],
        START,
      )

      expect(results).toEqual(record('project-b', 'layer-a', START, 200n))
    })

    it('should return undefined if no data is available', async () => {
      await repository.upsertMany([
        record('project-a', 'layer-a', START, 100n),
        record('project-b', 'layer-a', START, 200n),
      ])

      const results = await repository.getLargestPosterByProjectIdsAndTimestamp(
        ['project-a', 'project-b'],
        START.add(1, 'days'),
      )

      expect(results).toEqual(undefined)
    })
  })

  describe(DataAvailabilityRepository.prototype.deleteByProject.name, () => {
    it('should delete records within the specified time range', async () => {
      await repository.upsertMany([
        record('project-a', 'layer-a', START, 100n),
        record('project-b', 'layer-a', START, 100n),
        record('project-a', 'layer-b', START, 100n),
        record('project-a', 'layer-a', START.add(1, 'days'), 200n),
      ])

      const deletedCount = await repository.deleteByProject(
        'project-a',
        'layer-a',
      )

      expect(deletedCount).toEqual(2)

      const remainingRecords = await repository.getAll()
      expect(remainingRecords).toEqualUnsorted([
        record('project-b', 'layer-a', START, 100n),
        record('project-a', 'layer-b', START, 100n),
      ])
    })
  })

  describe(DataAvailabilityRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.upsertMany([
        record('project-a', 'layer-a', START, 100n),
        record('project-b', 'layer-a', START, 200n),
      ])

      const deleteResult = await repository.deleteAll()
      const results = await repository.getAll()

      expect(deleteResult).toEqual(2)
      expect(results).toEqual([])
    })
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function record(
  projectId: string,
  daLayer: string,
  timestamp: UnixTime,
  totalSize: bigint,
): DataAvailabilityRecord {
  return {
    projectId,
    daLayer,
    timestamp,
    totalSize,
  }
}
