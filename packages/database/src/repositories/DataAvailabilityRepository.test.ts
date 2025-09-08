import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type DataAvailabilityRecord,
  DataAvailabilityRepository,
} from './DataAvailabilityRepository'

describeDatabase(DataAvailabilityRepository.name, (db) => {
  const repository = db.dataAvailability

  const START = UnixTime.now()

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(DataAvailabilityRepository.prototype.upsertMany.name, () => {
    it('adds new rows', async () => {
      await repository.upsertMany([
        record('project-a', 'layer-a', 'config-id-1', START, 100n),
        record('project-b', 'layer-a', 'config-id-2', START, 200n),
        record('project-c', 'layer-b', 'config-id-3', START, 300n),
        record(
          'project-c',
          'layer-b',
          'config-id-4',
          START + 1 * UnixTime.DAY,
          400n,
        ),
      ])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        record('project-a', 'layer-a', 'config-id-1', START, 100n),
        record('project-b', 'layer-a', 'config-id-2', START, 200n),
        record('project-c', 'layer-b', 'config-id-3', START, 300n),
        record(
          'project-c',
          'layer-b',
          'config-id-4',
          START + 1 * UnixTime.DAY,
          400n,
        ),
      ])
    })

    it('merges on conflict', async () => {
      await repository.upsertMany([
        record('project-a', 'layer-a', 'config-id-1', START, 100n),
        record('project-a', 'layer-a', 'config-id-2', START, 100n),
        record('project-b', 'layer-a', 'config-id-3', START, 200n),
        record('project-c', 'layer-b', 'config-id-4', START, 300n),
      ])
      await repository.upsertMany([
        record('project-a', 'layer-a', 'config-id-1', START, 1_000n),
        record('project-a', 'layer-a', 'config-id-2', START, 1_000n),
        record('project-b', 'layer-a', 'config-id-3', START, 2_000n),
      ])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        record('project-a', 'layer-a', 'config-id-1', START, 1_000n),
        record('project-a', 'layer-a', 'config-id-2', START, 1_000n),
        record('project-b', 'layer-a', 'config-id-3', START, 2_000n),
        record('project-c', 'layer-b', 'config-id-4', START, 300n),
      ])
    })

    it('returns number of processed records', async () => {
      const records = [
        record('project-a', 'layer-a', 'config-id-1', START, 100n),
        record('project-b', 'layer-a', 'config-id-2', START, 200n),
      ]
      const result = await repository.upsertMany(records)
      expect(result).toEqual(2)
    })

    it('returns 0 for empty array', async () => {
      const result = await repository.upsertMany([])
      expect(result).toEqual(0)
    })
  })

  describe(
    DataAvailabilityRepository.prototype.getForDaLayerInTimeRange.name,
    () => {
      it('returns records for a DA layer within time range', async () => {
        await repository.upsertMany([
          record('project-a', 'layer-a', 'config-id', START, 100n),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 1 * UnixTime.DAY,
            200n,
          ),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 2 * UnixTime.DAY,
            300n,
          ),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 3 * UnixTime.DAY,
            400n,
          ),
        ])

        const results = await repository.getForDaLayerInTimeRange(
          'layer-a',
          START,
          START + 3 * UnixTime.DAY,
        )

        expect(results).toEqualUnsorted([
          record('project-a', 'layer-a', 'config-id', START, 100n),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 1 * UnixTime.DAY,
            200n,
          ),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 2 * UnixTime.DAY,
            300n,
          ),
        ])
      })

      it('returns empty array when no records exist for DA layer', async () => {
        await repository.upsertMany([
          record('project-a', 'layer-a', 'config-id', START, 100n),
          record('project-b', 'layer-b', 'config-id', START, 100n),
        ])

        const results = await repository.getForDaLayerInTimeRange(
          'layer-c',
          START,
          START + 1 * UnixTime.DAY,
        )

        expect(results).toEqual([])
      })

      it('returns empty array when no records exist in time range', async () => {
        await repository.upsertMany([
          record('project-1', 'layer-1', 'config-id', START, 100n),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 1 * UnixTime.DAY,
            200n,
          ),
        ])

        const results = await repository.getForDaLayerInTimeRange(
          'ethereum',
          START + 2 * UnixTime.DAY,
          START + 3 * UnixTime.DAY,
        )

        expect(results).toEqual([])
      })

      it('handles empty database', async () => {
        const results = await repository.getForDaLayerInTimeRange(
          'ethereum',
          START,
          START + 1 * UnixTime.DAY,
        )

        expect(results).toEqual([])
      })
    },
  )

  describe(
    DataAvailabilityRepository.prototype.getForDaLayerByTimestamp.name,
    () => {
      it('returns records for a DA layer at a specific timestamp', async () => {
        await repository.upsertMany([
          record('project-a', 'layer-a', 'config-id', START, 100n),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 1 * UnixTime.DAY,
            200n,
          ),
          record(
            'project-b',
            'layer-a',
            'config-id',
            START + 1 * UnixTime.DAY,
            300n,
          ),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 2 * UnixTime.DAY,
            300n,
          ),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 3 * UnixTime.DAY,
            400n,
          ),
        ])

        const results = await repository.getForDaLayerByTimestamp(
          'layer-a',
          START + 1 * UnixTime.DAY,
        )

        expect(results).toEqualUnsorted([
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 1 * UnixTime.DAY,
            200n,
          ),
          record(
            'project-b',
            'layer-a',
            'config-id',
            START + 1 * UnixTime.DAY,
            300n,
          ),
        ])
      })
    },
  )

  describe(
    DataAvailabilityRepository.prototype.getByProjectIdsAndTimeRange.name,
    () => {
      it('should return records for projects in given time range', async () => {
        await repository.upsertMany([
          record('project-a', 'layer-a', 'config-id', START, 100n),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 1 * UnixTime.DAY,
            1_000n,
          ),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 2 * UnixTime.DAY,
            10_000n,
          ),
          record('project-b', 'layer-a', 'config-id', START, 200n),
          record(
            'project-b',
            'layer-a',
            'config-id',
            START + 1 * UnixTime.DAY,
            2_000n,
          ),
          record('project-c', 'layer-a', 'config-id', START, 300n),
        ])

        const results = await repository.getByProjectIdsAndTimeRange(
          ['project-a', 'project-b'],
          [START, START + 2 * UnixTime.DAY],
        )

        expect(results).toEqualUnsorted([
          record('project-a', 'layer-a', 'config-id', START, 100n),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 1 * UnixTime.DAY,
            1_000n,
          ),
          record('project-b', 'layer-a', 'config-id', START, 200n),
          record(
            'project-b',
            'layer-a',
            'config-id',
            START + 1 * UnixTime.DAY,
            2_000n,
          ),
        ])
      })

      it('allows to query for null from', async () => {
        await repository.upsertMany([
          record('project-a', 'layer-a', 'config-id', START, 100n),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 1 * UnixTime.DAY,
            1_000n,
          ),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 2 * UnixTime.DAY,
            1_000n,
          ),
        ])

        const results = await repository.getByProjectIdsAndTimeRange(
          ['project-a', 'project-b'],
          [null, START + 1 * UnixTime.DAY],
        )

        expect(results).toEqualUnsorted([
          record('project-a', 'layer-a', 'config-id', START, 100n),
        ])
      })
    },
  )

  describe(
    DataAvailabilityRepository.prototype.getByDaLayersAndTimeRange.name,
    () => {
      it('should return records for projects in given time range', async () => {
        await repository.upsertMany([
          record('project-a', 'layer-a', 'config-id', START, 100n),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 1 * UnixTime.DAY,
            1_000n,
          ),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 2 * UnixTime.DAY,
            10_000n,
          ),
          record('project-b', 'layer-b', 'config-id', START, 200n),
          record(
            'project-b',
            'layer-b',
            'config-id',
            START + 1 * UnixTime.DAY,
            2_000n,
          ),
          record(
            'project-b',
            'layer-b',
            'config-id',
            START + 2 * UnixTime.DAY,
            2_000n,
          ),
          record('project-c', 'layer-a', 'config-id', START, 300n),
        ])

        const results = await repository.getByDaLayersAndTimeRange(
          ['layer-b'],
          [START, START + 2 * UnixTime.DAY],
        )

        expect(results).toEqual([
          record('project-b', 'layer-b', 'config-id', START, 200n),
          record(
            'project-b',
            'layer-b',
            'config-id',
            START + 1 * UnixTime.DAY,
            2_000n,
          ),
        ])
      })

      it('allows to query for null from', async () => {
        await repository.upsertMany([
          record(
            'project-a',
            'layer-a',
            'config-id',
            START - 1 * UnixTime.DAY,
            100n,
          ),
          record('project-a', 'layer-a', 'config-id', START, 100n),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 1 * UnixTime.DAY,
            1_000n,
          ),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 2 * UnixTime.DAY,
            1_000n,
          ),
          record('project-b', 'layer-b', 'config-id', START, 1_000n),
        ])

        const results = await repository.getByDaLayersAndTimeRange(
          ['layer-a'],
          [null, START + 2 * UnixTime.DAY],
        )

        expect(results).toEqual([
          record(
            'project-a',
            'layer-a',
            'config-id',
            START - 1 * UnixTime.DAY,
            100n,
          ),
          record('project-a', 'layer-a', 'config-id', START, 100n),
          record(
            'project-a',
            'layer-a',
            'config-id',
            START + 1 * UnixTime.DAY,
            1_000n,
          ),
        ])
      })
    },
  )

  describe(
    DataAvailabilityRepository.prototype.getSummedProjectsByDaLayersAndTimeRange
      .name,
    () => {
      it('returns summed PROJECTS (not the daLayer itself)', async () => {
        await repository.upsertMany([
          record(
            'project-a',
            'layer-a',
            'config-id-1',
            START - 1 * UnixTime.DAY,
            100n,
          ),
          record('project-a', 'layer-a', 'config-id-1', START, 100n),
          record(
            'project-a',
            'layer-a',
            'config-id-2',
            START + 1 * UnixTime.DAY,
            1_000n,
          ),
          record(
            'project-a',
            'layer-a',
            'config-id-2',
            START + 2 * UnixTime.DAY,
            1_000n,
          ),
          record('project-c', 'layer-b', 'config-id-3', START, 1_000n),
          record('project-b', 'layer-a', 'config-id-4', START, 10n),
          record(
            'project-b',
            'layer-a',
            'config-id-5',
            START + 1 * UnixTime.DAY,
            2_000n,
          ),
          record(
            'layer-a',
            'layer-a',
            'config-id-6',
            START + 1 * UnixTime.DAY,
            1_000_000n,
          ),
        ])

        const results =
          await repository.getSummedProjectsByDaLayersAndTimeRange(
            ['layer-a'],
            [START, START + 2 * UnixTime.DAY],
          )

        expect(results).toEqual([
          { daLayer: 'layer-a', timestamp: START, totalSize: 110n },
          {
            daLayer: 'layer-a',
            timestamp: START + 1 * UnixTime.DAY,
            totalSize: 3_000n,
          },
        ])
      })
    },
  )

  describe(
    DataAvailabilityRepository.prototype.getMaxHistoricalRecordByDaLayer.name,
    () => {
      it('returns max historical record for each DA layer', async () => {
        await repository.upsertMany([
          // layer-a
          record('layer-a', 'layer-a', 'config-id-1', START, 100n),
          record(
            'layer-a',
            'layer-a',
            'config-id-2',
            START + 1 * UnixTime.DAY,
            300n,
          ),
          record(
            'layer-a',
            'layer-a',
            'config-id-3',
            START + 2 * UnixTime.DAY,
            200n,
          ),
          // layer-b
          record('layer-b', 'layer-b', 'config-id-4', START, 400n),
          record(
            'layer-b',
            'layer-b',
            'config-id-5',
            START + 2 * UnixTime.DAY,
            500n,
          ),
          // layer-c
          record('layer-c', 'layer-c', 'config-id-6', START, 100n),
          // Project records (should be ignored)
          record('project-a', 'layer-a', 'config-id-7', START, 1000n),
          record('project-b', 'layer-b', 'config-id-7', START, 2000n),
        ])

        const results = await repository.getMaxHistoricalRecordByDaLayer([
          'layer-a',
          'layer-b',
        ])

        expect(results).toEqualUnsorted([
          record(
            'layer-a',
            'layer-a',
            'config-id-2',
            START + 1 * UnixTime.DAY,
            300n,
          ),
          record(
            'layer-b',
            'layer-b',
            'config-id-5',
            START + 2 * UnixTime.DAY,
            500n,
          ),
        ])
      })

      it('returns empty array when daLayers array is empty', async () => {
        await repository.upsertMany([
          record('layer-a', 'layer-a', 'config-id-1', START, 100n),
          record('layer-b', 'layer-b', 'config-id-2', START, 200n),
        ])

        const results = await repository.getMaxHistoricalRecordByDaLayer([])

        expect(results).toEqual([])
      })

      it('returns empty array when no records exist for specified layers', async () => {
        await repository.upsertMany([
          record('layer-a', 'layer-a', 'config-id-1', START, 100n),
          record('layer-b', 'layer-b', 'config-id-2', START, 200n),
        ])

        const results = await repository.getMaxHistoricalRecordByDaLayer([
          'layer-c',
          'layer-d',
        ])

        expect(results).toEqual([])
      })
    },
  )

  describe(
    DataAvailabilityRepository.prototype.deleteByConfigurationId.name,
    () => {
      it('should delete records within the specified time range', async () => {
        await repository.upsertMany([
          record('project-a', 'layer-a', 'config-id-1', START, 100n),
          record('project-b', 'layer-a', 'config-id-2', START, 100n),
          record('project-a', 'layer-a', 'config-id-3', START, 100n),
          record(
            'project-a',
            'layer-a',
            'config-id-1',
            START + 1 * UnixTime.DAY,
            200n,
          ),
        ])

        const deletedCount =
          await repository.deleteByConfigurationId('config-id-1')

        expect(deletedCount).toEqual(2)

        const remainingRecords = await repository.getAll()
        expect(remainingRecords).toEqualUnsorted([
          record('project-b', 'layer-a', 'config-id-2', START, 100n),
          record('project-a', 'layer-a', 'config-id-3', START, 100n),
        ])
      })
    },
  )

  describe(DataAvailabilityRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.upsertMany([
        record('project-a', 'layer-a', 'config-id', START, 100n),
        record('project-b', 'layer-a', 'config-id', START, 200n),
      ])

      const deleteResult = await repository.deleteAll()
      const results = await repository.getAll()

      expect(deleteResult).toEqual(2)
      expect(results).toEqual([])
    })
  })
})

function record(
  projectId: string,
  daLayer: string,
  configurationId: string,
  timestamp: UnixTime,
  totalSize: bigint,
): DataAvailabilityRecord {
  return {
    timestamp,
    daLayer,
    projectId,
    configurationId,
    totalSize,
  }
}
