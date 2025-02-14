import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import type { DataAvailabilityRecord } from './entity'
import { DataAvailabilityRepository } from './repository'

describeDatabase(DataAvailabilityRepository.name, (db) => {
  const repository = db.dataAvailability

  const START = UnixTime.now()

  describe.skip(DataAvailabilityRepository.prototype.upsertMany.name, () => {
    it('adds new rows', async () => {
      await repository.upsertMany([
        record('a', 'project-a', 'layer-a,', START, 100n),
        record('b', 'project-b', 'layer-a,', START, 200n),
        record('c', 'project-c', 'layer-b,', START, 300n),
        record('c', 'project-c', 'layer-b,', START.add(1, 'days'), 400n),
      ])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        record('a', 'project-a', 'layer-a,', START, 100n),
        record('b', 'project-b', 'layer-a,', START, 200n),
        record('c', 'project-c', 'layer-b,', START, 300n),
        record('c', 'project-c', 'layer-b,', START.add(1, 'days'), 400n),
      ])
    })

    it('merges on conflict', async () => {
      await repository.upsertMany([
        record('a', 'project-a', 'layer-a,', START, 100n),
        record('b', 'project-b', 'layer-a,', START, 200n),
        record('c', 'project-c', 'layer-b,', START, 300n),
      ])
      await repository.upsertMany([
        record('a', 'project-a', 'layer-a,', START, 1_000n),
        record('b', 'project-b', 'layer-a,', START, 2_000n),
      ])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        record('a', 'project-a', 'layer-a,', START, 1_000n),
        record('b', 'project-b', 'layer-a,', START, 2_000n),
        record('c', 'project-c', 'layer-b,', START, 300n),
      ])
    })

    it('returns number of processed records', async () => {
      const records = [
        record('a', 'project-a', 'layer-a,', START, 100n),
        record('b', 'project-b', 'layer-a,', START, 200n),
      ]
      const result = await repository.upsertMany(records)
      expect(result).toEqual(2)
    })

    it('returns 0 for empty array', async () => {
      const result = await repository.upsertMany([])
      expect(result).toEqual(0)
    })
  })

  describe.skip(DataAvailabilityRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.upsertMany([
        record('a', 'project-a', 'layer-a,', START, 100n),
        record('b', 'project-b', 'layer-a,', START, 200n),
      ])

      const deleteResult = await repository.deleteAll()
      const results = await repository.getAll()

      expect(deleteResult).toEqual(2)
      expect(results).toEqual([])
    })
  })

  describe.skip(DataAvailabilityRepository.prototype.getByProjectIdsAndTimeRange
    .name, () => {
    it('should return records for projects in given time range', async () => {
      await repository.upsertMany([
        record('a', 'project-a', 'layer-a,', START, 100n),
        record('a', 'project-a', 'layer-a,', START.add(1, 'days'), 1_000n),
        record('a', 'project-a', 'layer-a,', START.add(2, 'days'), 10_000n),
        record('b', 'project-b', 'layer-a,', START, 200n),
        record('b', 'project-b', 'layer-a,', START.add(1, 'days'), 2_000n),
        record('c', 'project-c', 'layer-a,', START, 300n),
      ])

      const results = await repository.getByProjectIdsAndTimeRange(
        ['project-a', 'project-b'],
        [START, START.add(1, 'days')],
      )

      expect(results).toEqualUnsorted([
        record('a', 'project-a', 'layer-a,', START, 100n),
        record('a', 'project-a', 'layer-a,', START.add(1, 'days'), 1_000n),
        record('b', 'project-b', 'layer-a,', START, 200n),
        record('b', 'project-b', 'layer-a,', START.add(1, 'days'), 2_000n),
      ])
    })
  })

  describe.skip(DataAvailabilityRepository.prototype
    .getLargestPosterByProjectIdsAndTimestamp.name, () => {
    it('should return the largest poster at a given timestamp', async () => {
      await repository.upsertMany([
        record('a', 'project-a', 'layer-a,', START, 100n),
        record('a', 'project-a', 'layer-a,', START.add(1, 'days'), 1_000n),
        record('b', 'project-b', 'layer-a,', START, 200n),
        record('b', 'project-b', 'layer-a,', START.add(1, 'days'), 2_000n),
        record('c', 'project-c', 'layer-a,', START, 300n),
      ])

      const results = await repository.getLargestPosterByProjectIdsAndTimestamp(
        ['project-a', 'project-b'],
        START,
      )

      expect(results).toEqual(record('b', 'project-b', 'layer-a,', START, 200n))
    })

    it('should return undefined if no data is available', async () => {
      await repository.upsertMany([
        record('a', 'project-a', 'layer-a,', START, 100n),
        record('b', 'project-b', 'layer-a,', START, 200n),
      ])

      const results = await repository.getLargestPosterByProjectIdsAndTimestamp(
        ['project-a', 'project-b'],
        START.add(1, 'days'),
      )

      expect(results).toEqual(undefined)
    })
  })

  describe.skip(DataAvailabilityRepository.prototype.deleteByProjectFrom
    .name, () => {
    it('should delete all rows after a given timestamp for a project', async () => {
      await repository.upsertMany([
        record('a', 'project-a', 'layer-a,', START, 100n),
        record('a', 'project-a', 'layer-a,', START.add(1, 'days'), 100n),
        record('a', 'project-a', 'layer-a,', START.add(2, 'days'), 100n),
        record('b', 'project-b', 'layer-a,', START, 200n),
      ])

      const deleteResult = await repository.deleteByProjectFrom(
        'project-a',
        START.add(1, 'days'),
      )

      const results = await repository.getAll()

      expect(deleteResult).toEqual(2)
      expect(results).toEqualUnsorted([
        record('a', 'project-a', 'layer-a,', START, 100n),
        record('b', 'project-b', 'layer-a,', START, 200n),
      ])
    })
  })

  describe.skip(DataAvailabilityRepository.prototype.getByProjectAndTimeRange
    .name, () => {
    it('should return all rows in a given time range for a project', async () => {
      const records = [
        record('a', 'project-a', 'layer-a,', START, 100n),
        record('a', 'project-a', 'layer-a,', START.add(1, 'days'), 100n),
        record('a', 'project-a', 'layer-a,', START.add(2, 'days'), 100n),
        record('b', 'project-b', 'layer-a,', START, 200n),
      ]

      await repository.upsertMany(records)

      const results = await repository.getByProjectAndTimeRange('project-a', [
        START.add(1, 'days'),
        START.add(2, 'days'),
      ])

      expect(results).toEqual([
        record('a', 'project-a', 'layer-a,', START.add(1, 'days'), 100n),
        record('a', 'project-a', 'layer-a,', START.add(2, 'days'), 100n),
      ])
    })
  })

  describe.skip(DataAvailabilityRepository.prototype.getByProjectIdAndFrom
    .name, () => {
    it('should return all rows from given timestamp for a project', async () => {
      await repository.upsertMany([
        record('a', 'project-a', 'layer-a,', START, 100n),
        record('a', 'project-a', 'layer-a,', START.add(1, 'days'), 100n),
        record('a', 'project-a', 'layer-a,', START.add(2, 'days'), 100n),
        record('b', 'project-b', 'layer-a,', START, 200n),
      ])

      const results = await repository.getByProjectIdAndFrom(
        'project-a',
        START.add(1, 'days'),
      )

      expect(results).toEqual([
        record('a', 'project-a', 'layer-a,', START.add(1, 'days'), 100n),
        record('a', 'project-a', 'layer-a,', START.add(2, 'days'), 100n),
      ])
    })
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function record(
  configurationId: string,
  projectId: string,
  daLayer: string,
  timestamp: UnixTime,
  totalSize: bigint,
): DataAvailabilityRecord {
  return {
    configurationId: configurationId.repeat(12),
    projectId,
    daLayer,
    timestamp,
    totalSize,
  }
}
