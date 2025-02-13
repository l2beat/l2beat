import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import type { DataAvailabilityRecord } from './entity'
import { DataAvailabilityRepository } from './repository'

describeDatabase(DataAvailabilityRepository.name, (db) => {
  const repository = db.dataAvailability

  const START = UnixTime.now()

  describe(DataAvailabilityRepository.prototype.getForDaLayerInTimeRange
    .name, () => {
    it('returns records for a DA layer within time range', async () => {
      await repository.upsertMany([
        record('a', START, 100n, 'ethereum'),
        record('b', START.add(1, 'days'), 200n, 'ethereum'),
        record('c', START.add(2, 'days'), 300n, 'ethereum'),
        record('d', START.add(1, 'days'), 400n, 'celestia'),
      ])

      const results = await repository.getForDaLayerInTimeRange(
        'ethereum',
        START,
        START.add(2, 'days'),
      )

      expect(results).toEqualUnsorted([
        record('a', START, 100n, 'ethereum'),
        record('b', START.add(1, 'days'), 200n, 'ethereum'),
        record('c', START.add(2, 'days'), 300n, 'ethereum'),
      ])
    })

    it('returns empty array when no records exist for DA layer', async () => {
      await repository.upsertMany([
        record('a', START, 100n, 'ethereum'),
        record('b', START.add(1, 'days'), 200n, 'ethereum'),
      ])

      const results = await repository.getForDaLayerInTimeRange(
        'celestia',
        START,
        START.add(1, 'days'),
      )

      expect(results).toEqual([])
    })

    it('returns empty array when no records exist in time range', async () => {
      await repository.upsertMany([
        record('a', START, 100n, 'ethereum'),
        record('b', START.add(1, 'days'), 200n, 'ethereum'),
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

  describe(DataAvailabilityRepository.prototype.upsertMany.name, () => {
    it('adds new rows', async () => {
      await repository.upsertMany([
        record('a', START, 100n),
        record('a', START.add(1, 'days'), 200n),
        record('a', START.add(2, 'days'), 300n),
      ])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        record('a', START, 100n),
        record('a', START.add(1, 'days'), 200n),
        record('a', START.add(2, 'days'), 300n),
      ])
    })

    it('merges on conflict', async () => {
      await repository.upsertMany([
        record('a', START, 100n),
        record('a', START.add(1, 'days'), 200n),
      ])
      await repository.upsertMany([record('a', START, 150n)])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        record('a', START, 150n),
        record('a', START.add(1, 'days'), 200n),
      ])
    })

    it('returns number of processed records', async () => {
      const records = [
        record('a', START, 100n),
        record('a', START.add(1, 'days'), 200n),
      ]
      const result = await repository.upsertMany(records)
      expect(result).toEqual(2)
    })

    it('returns 0 for empty array', async () => {
      const result = await repository.upsertMany([])
      expect(result).toEqual(0)
    })
  })

  describe(DataAvailabilityRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.upsertMany([
        record('a', START, 100n),
        record('a', START.add(1, 'days'), 200n),
      ])

      const deleteResult = await repository.deleteAll()
      const results = await repository.getAll()

      expect(deleteResult).toEqual(2)
      expect(results).toEqual([])
    })
  })

  describe(DataAvailabilityRepository.prototype.getByProjectIdsAndTimeRange
    .name, () => {
    it('should return the latest record for each project', async () => {
      await repository.upsertMany([
        record('a', START, 100n),
        record('a', START.add(1, 'days'), 200n),
        record('b', START, 300n),
        record('b', START.add(2, 'days'), 300n),
      ])

      const results = await repository.getByProjectIdsAndTimeRange(
        ['a', 'b'],
        [START, START.add(1, 'days')],
      )

      expect(results).toEqualUnsorted([
        record('a', START, 100n),
        record('a', START.add(1, 'days'), 200n),
        record('b', START, 300n),
      ])
    })

    it('should return omit project without data', async () => {
      await repository.upsertMany([
        record('a', START, 100n),
        record('a', START.add(1, 'days'), 200n),
      ])

      const results = await repository.getByProjectIdsAndTimeRange(
        ['a', 'b'],
        [START, START.add(1, 'days')],
      )

      expect(results).toEqualUnsorted([
        record('a', START, 100n),
        record('a', START.add(1, 'days'), 200n),
      ])
    })
  })

  describe(DataAvailabilityRepository.prototype
    .getLargestPosterByProjectIdsAndTimestamp.name, () => {
    it('should return the largest poster at a given timestamp', async () => {
      await repository.upsertMany([
        record('a', START, 100n),
        record('a', START.add(1, 'days'), 200n),
        record('b', START, 300n),
        record('b', START.add(1, 'days'), 400n),
      ])

      const results = await repository.getLargestPosterByProjectIdsAndTimestamp(
        ['a', 'b'],
        START,
      )

      expect(results).toEqual(record('b', START, 300n))
    })

    it('should return undefined if no data is available', async () => {
      await repository.upsertMany([
        record('a', START, 100n),
        record('b', START, 300n),
      ])

      const results = await repository.getLargestPosterByProjectIdsAndTimestamp(
        ['a', 'b'],
        START.add(1, 'days'),
      )

      expect(results).toEqual(undefined)
    })
  })

  describe(DataAvailabilityRepository.prototype.deleteByProjectFrom
    .name, () => {
    it('should delete all rows after a given timestamp for a project', async () => {
      await repository.upsertMany([
        record('a', START, 100n),
        record('a', START.add(1, 'days'), 200n),
        record('a', START.add(2, 'days'), 300n),
        record('b', START.add(2, 'days'), 400n),
      ])

      const deleteResult = await repository.deleteByProjectFrom(
        'a',
        START.add(1, 'days'),
      )

      const results = await repository.getAll()

      expect(deleteResult).toEqual(2)
      expect(results).toEqualUnsorted([
        record('a', START, 100n),
        record('b', START.add(2, 'days'), 400n),
      ])
    })
  })

  describe(DataAvailabilityRepository.prototype.getByProjectAndTimeRange
    .name, () => {
    it('should return all rows in a given time range for a project', async () => {
      const records = [
        record('a', START, 100n),
        record('a', START.add(1, 'days'), 200n),
        record('a', START.add(2, 'days'), 300n),
        record('b', START.add(1, 'days'), 400n),
      ]

      await repository.upsertMany(records)

      const results = await repository.getByProjectAndTimeRange('a', [
        START.add(1, 'days'),
        START.add(2, 'days'),
      ])

      expect(results).toEqual([
        record('a', START.add(1, 'days'), 200n),
        record('a', START.add(2, 'days'), 300n),
      ])
    })
  })

  describe(DataAvailabilityRepository.prototype.getByProjectIdAndFrom
    .name, () => {
    it('should return all rows from given timestamp for a project', async () => {
      await repository.upsertMany([
        record('a', START, 100n),
        record('a', START.add(1, 'days'), 200n),
        record('a', START.add(2, 'days'), 300n),
        record('b', START.add(1, 'days'), 400n),
      ])

      const results = await repository.getByProjectIdAndFrom(
        'a',
        START.add(1, 'days'),
      )

      expect(results).toEqual([
        record('a', START.add(1, 'days'), 200n),
        record('a', START.add(2, 'days'), 300n),
      ])
    })
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function record(
  projectId: string,
  timestamp: UnixTime,
  totalSize: bigint,
  daLayer = 'ethereum',
): DataAvailabilityRecord {
  return {
    projectId,
    daLayer,
    timestamp,
    totalSize,
  }
}
