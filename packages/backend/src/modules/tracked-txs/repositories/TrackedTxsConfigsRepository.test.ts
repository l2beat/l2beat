import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import { LivenessRepository } from '../modules/liveness/repositories/LivenessRepository'
import { TrackedTxId } from '../types/TrackedTxId'
import {
  TrackedTxsConfigRecord,
  TrackedTxsConfigsRepository,
} from './TrackedTxsConfigsRepository'

const START = UnixTime.now()

export const TRACKED_TXS_RECORDS: TrackedTxsConfigRecord[] = [
  makeTrackedTxsConfigRecord({
    projectId: ProjectId('project1'),
    type: 'liveness',
    subtype: 'batchSubmissions',
    id: TrackedTxId(['0x13']),
    sinceTimestampInclusive: START.add(-1, 'hours'),
    debugInfo: '',
  }),
  makeTrackedTxsConfigRecord({
    projectId: ProjectId('project2'),
  }),
  makeTrackedTxsConfigRecord({
    projectId: ProjectId('project3'),
    type: 'liveness',
    subtype: 'proofSubmissions',
    id: TrackedTxId(['0x123']),
  }),
]

describeDatabase(TrackedTxsConfigsRepository.name, (database) => {
  const repository = new TrackedTxsConfigsRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(TrackedTxsConfigsRepository.prototype.addMany.name, () => {
    it('should add new rows', async () => {
      await repository.addMany(TRACKED_TXS_RECORDS)
      const results = await repository.getAll()

      expect(results).toEqualUnsorted(TRACKED_TXS_RECORDS)
    })

    it('empty array', async () => {
      await expect(repository.addMany([])).not.toBeRejected()
    })
  })

  describe(TrackedTxsConfigsRepository.prototype.getByProjectId.name, () => {
    it('should return configs for given project id', async () => {
      await repository.addMany(TRACKED_TXS_RECORDS)
      const results = await repository.getByProjectId(ProjectId('project1'))

      expect(results).toEqualUnsorted([TRACKED_TXS_RECORDS[0]])
    })

    it('should return empty array if no configs for given project id', async () => {
      await repository.addMany(TRACKED_TXS_RECORDS)
      const results = await repository.getByProjectId(ProjectId('project4'))

      expect(results).toEqualUnsorted([])
    })
  })

  describe(
    TrackedTxsConfigsRepository.prototype
      .findLatestSyncedTimestampByProjectIdAndSubtype.name,
    () => {
      it('should return latest synced timestamp for given project id and subtype', async () => {
        await repository.addMany(TRACKED_TXS_RECORDS)

        const latest = UnixTime.now()

        await repository.setManyLastSyncedTimestamp(
          [TRACKED_TXS_RECORDS[0].id, TRACKED_TXS_RECORDS[1].id],
          latest,
        )

        const results =
          await repository.findLatestSyncedTimestampByProjectIdAndSubtype(
            ProjectId('project1'),
            'batchSubmissions',
          )

        expect(results).toEqual(latest)
      })

      it('should return undefined if no latest synced timestamp for given project id and subtype', async () => {
        await repository.addMany(TRACKED_TXS_RECORDS)

        const firstResult =
          await repository.findLatestSyncedTimestampByProjectIdAndSubtype(
            ProjectId('project1'),
            'batchSubmissions',
          )

        const secondResult =
          await repository.findLatestSyncedTimestampByProjectIdAndSubtype(
            ProjectId('random-project-id'),
            'batchSubmissions',
          )

        expect(firstResult).toEqual(undefined)
        expect(secondResult).toEqual(undefined)
      })
    },
  )

  describe(
    TrackedTxsConfigsRepository.prototype.setLastSyncedTimestamp.name,
    () => {
      it('updates last synced timestamp of given id', async () => {
        await repository.addMany(TRACKED_TXS_RECORDS)

        const latest = UnixTime.now()

        await repository.setLastSyncedTimestamp(
          TRACKED_TXS_RECORDS[0].id,
          latest,
        )

        const results = await repository.getAll()

        expect(results).toEqualUnsorted([
          {
            ...TRACKED_TXS_RECORDS[0],
            lastSyncedTimestamp: latest,
          },
          {
            ...TRACKED_TXS_RECORDS[1],
          },
          {
            ...TRACKED_TXS_RECORDS[2],
          },
        ])
      })

      it('does not update if configuration not found', async () => {
        await repository.addMany(TRACKED_TXS_RECORDS)

        const latest = UnixTime.now()

        await repository.setLastSyncedTimestamp(TrackedTxId(['']), latest)

        const results = await repository.getAll()
        expect(results).toEqualUnsorted(TRACKED_TXS_RECORDS)
      })
    },
  )

  describe(
    TrackedTxsConfigsRepository.prototype.setManyLastSyncedTimestamp.name,
    () => {
      it('updates last synced timestamp of given configuration', async () => {
        await repository.addMany(TRACKED_TXS_RECORDS)

        const latest = UnixTime.now()

        await repository.setManyLastSyncedTimestamp(
          [TRACKED_TXS_RECORDS[0].id, TRACKED_TXS_RECORDS[1].id],
          latest,
        )

        const results = await repository.getAll()

        expect(results).toEqualUnsorted([
          {
            ...TRACKED_TXS_RECORDS[0],
            lastSyncedTimestamp: latest,
          },
          {
            ...TRACKED_TXS_RECORDS[1],
            lastSyncedTimestamp: latest,
          },
          {
            ...TRACKED_TXS_RECORDS[2],
          },
        ])
      })

      it('does not update if configuration not found', async () => {
        await repository.addMany(TRACKED_TXS_RECORDS)

        const latest = UnixTime.now()

        await repository.setManyLastSyncedTimestamp([TrackedTxId([''])], latest)

        const results = await repository.getAll()
        expect(results).toEqualUnsorted(TRACKED_TXS_RECORDS)
      })
    },
  )

  describe(TrackedTxsConfigsRepository.prototype.setUntilTimestamp.name, () => {
    it('updates last synced timestamp of given configuration', async () => {
      const newIds = await repository.addMany(TRACKED_TXS_RECORDS)

      const untilTimestamp = UnixTime.now()
      const updatedRow: TrackedTxsConfigRecord = {
        ...TRACKED_TXS_RECORDS[0],
        untilTimestampExclusive: untilTimestamp,
      }

      await repository.setUntilTimestamp(newIds[0], untilTimestamp)
      const results = await repository.getAll()

      expect(results).toEqualUnsorted([
        updatedRow,
        ...TRACKED_TXS_RECORDS.slice(1),
      ])
    })

    it('does not update if configuration not found', async () => {
      await repository.addMany(TRACKED_TXS_RECORDS)

      const untilTimestamp = UnixTime.now()

      await repository.setUntilTimestamp(TrackedTxId(['']), untilTimestamp)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted(TRACKED_TXS_RECORDS)
    })
  })

  describe(TrackedTxsConfigsRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      await repository.addMany(TRACKED_TXS_RECORDS)

      const results = await repository.getAll()

      expect(results).toEqualUnsorted(TRACKED_TXS_RECORDS)
    })
  })

  describe(TrackedTxsConfigsRepository.prototype.deleteMany.name, () => {
    it('should delete rows', async () => {
      const newIds = await repository.addMany(TRACKED_TXS_RECORDS)
      const all = await repository.getAll()

      await repository.deleteMany(newIds.slice(1))

      const results = await repository.getAll()

      expect(results).toEqualUnsorted([all[0]])
    })

    it('should delete from child tables via CASCADE constraint', async () => {
      const newIds = await repository.addMany(TRACKED_TXS_RECORDS)

      const childRepository = new LivenessRepository(database, Logger.SILENT)
      await childRepository.deleteAll()
      await childRepository.addMany([
        {
          timestamp: UnixTime.now(),
          blockNumber: 0,
          txHash: '0x',
          trackedTxId: newIds[1],
        },
      ])

      await repository.deleteMany(newIds.slice(1))
      const results = await repository.getAll()
      expect(results).toEqualUnsorted([TRACKED_TXS_RECORDS[0]])

      const childResults = await childRepository.getAll()
      expect(childResults).toEqualUnsorted([])
    })

    it('empty array', async () => {
      await expect(repository.deleteMany([])).not.toBeRejected()
    })
  })
})

function makeTrackedTxsConfigRecord(
  props?: Partial<TrackedTxsConfigRecord>,
): TrackedTxsConfigRecord {
  return {
    projectId: ProjectId('random-project-id'),
    sinceTimestampInclusive: START,
    id: TrackedTxId(['0x']),
    type: 'liveness',
    subtype: 'batchSubmissions',
    debugInfo: '',
    lastSyncedTimestamp: undefined,
    untilTimestampExclusive: undefined,
    ...props,
  }
}
