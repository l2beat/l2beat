import { Logger } from '@l2beat/backend-tools'
import {
  EthereumAddress,
  ProjectId,
  TrackedTxsConfigSubtype,
  TrackedTxsConfigType,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import { TrackedTxsConfigRow } from 'knex/types/tables'

import { describeDatabase } from '../../../test/database'
import {
  TrackedTxConfigEntry,
  TrackedTxFunctionCallConfig,
} from '../types/TrackedTxsConfig'
import { TrackedTxsId } from '../types/TrackedTxsId'
import {
  toNewRow,
  TrackedTxsConfigRecord,
  TrackedTxsConfigsRepository,
} from './TrackedTxsConfigsRepository'

const START = UnixTime.now()

export const TRACKED_TXS_CONFIGS: TrackedTxConfigEntry[] = [
  makeTrackedTxsFunctionCall({
    projectId: ProjectId('project1'),
    uses: [
      {
        type: 'liveness',
        subType: 'batchSubmissions',
        id: TrackedTxsId(['0x13']),
      },
    ],
  }),
  makeTrackedTxsFunctionCall({
    projectId: ProjectId('project2'),
  }),
  makeTrackedTxsFunctionCall({
    projectId: ProjectId('project3'),
    uses: [
      {
        type: 'liveness',
        subType: 'proofSubmissions',
        id: TrackedTxsId(['0x123']),
      },
    ],
  }),
]

describeDatabase(TrackedTxsConfigsRepository.name, (database) => {
  const repository = new TrackedTxsConfigsRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(TrackedTxsConfigsRepository.prototype.addMany.name, () => {
    it('should add new rows', async () => {
      await repository.addMany(TRACKED_TXS_CONFIGS)
      const results = await repository.getAll()

      expect(results).toEqualUnsorted(
        TRACKED_TXS_CONFIGS.flatMap(toNewRow).map(toRecord),
      )
    })

    it('empty array', async () => {
      await expect(repository.addMany([])).not.toBeRejected()
    })
  })

  describe(
    TrackedTxsConfigsRepository.prototype.setLastSyncedTimestamp.name,
    () => {
      it('updates last synced timestamp of given configuration', async () => {
        await repository.addMany(TRACKED_TXS_CONFIGS)

        const latest = UnixTime.now()

        await repository.setLastSyncedTimestamp(
          [
            TRACKED_TXS_CONFIGS[0].uses[0].id,
            TRACKED_TXS_CONFIGS[1].uses[0].id,
          ],
          latest,
        )

        const results = await repository.getAll()

        expect(results).toEqualUnsorted([
          {
            ...toRecord(toNewRow(TRACKED_TXS_CONFIGS[0])[0]),
            lastSyncedTimestamp: latest,
          },
          {
            ...toRecord(toNewRow(TRACKED_TXS_CONFIGS[1])[0]),
            lastSyncedTimestamp: latest,
          },
          {
            ...toRecord(toNewRow(TRACKED_TXS_CONFIGS[1])[1]),
          },
          ...entryToResult(TRACKED_TXS_CONFIGS.slice(2)),
        ])
      })

      it('does not update if configuration not found', async () => {
        await repository.addMany(TRACKED_TXS_CONFIGS)

        const latest = UnixTime.now()

        await repository.setLastSyncedTimestamp([TrackedTxsId([''])], latest)

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([...entryToResult(TRACKED_TXS_CONFIGS)])
      })
    },
  )

  describe(TrackedTxsConfigsRepository.prototype.setUntilTimestamp.name, () => {
    it('updates last synced timestamp of given configuration', async () => {
      const newIds = await repository.addMany(TRACKED_TXS_CONFIGS)

      const untilTimestamp = UnixTime.now()
      const updatedRow: TrackedTxsConfigRecord = {
        ...toRecord(toNewRow(TRACKED_TXS_CONFIGS[0])[0]),
        untilTimestamp: untilTimestamp,
      }
      console.log('updatedRow', [
        updatedRow,
        ...entryToResult(TRACKED_TXS_CONFIGS.slice(1)),
      ])

      await repository.setUntilTimestamp(newIds[0], untilTimestamp)

      const results = await repository.getAll()
      console.log(results)
      expect(results).toEqualUnsorted([
        updatedRow,
        ...entryToResult(TRACKED_TXS_CONFIGS.slice(1)),
      ])
    })

    it('does not update if configuration not found', async () => {
      await repository.addMany(TRACKED_TXS_CONFIGS)

      const untilTimestamp = UnixTime.now()

      await repository.setUntilTimestamp(TrackedTxsId(['']), untilTimestamp)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([...entryToResult(TRACKED_TXS_CONFIGS)])
    })
  })

  describe(TrackedTxsConfigsRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      await repository.addMany(TRACKED_TXS_CONFIGS)

      const results = await repository.getAll()

      expect(results).toEqualUnsorted(entryToResult(TRACKED_TXS_CONFIGS))
    })
  })

  describe(TrackedTxsConfigsRepository.prototype.deleteMany.name, () => {
    it('should delete rows', async () => {
      const newIds = await repository.addMany(TRACKED_TXS_CONFIGS)
      const all = await repository.getAll()

      await repository.deleteMany(newIds.slice(1))

      const results = await repository.getAll()

      expect(results).toEqualUnsorted([all[0]])
    })

    // TODO: (tracked_txs) to add after modifying liveness table
    // it('should delete from child tables via CASCADE constraint', async () => {
    //   const newIds = await repository.addMany(TRACKED_TXS_CONFIGS)

    //   const childRepository = new LivenessRepository(database, Logger.SILENT)
    //   await childRepository.deleteAll()
    //   await childRepository.addMany([
    //     {
    //       timestamp: UnixTime.now(),
    //       blockNumber: 0,
    //       txHash: '0x',
    //       livenessId: newIds[1],
    //     },
    //   ])

    //   await repository.deleteMany(newIds.slice(1))
    //   const results = await repository.getAll()
    //   expect(results).toEqualUnsorted([toRecord(TRACKED_TXS_CONFIGS[0])])

    //   const childResults = await childRepository.getAll()
    //   expect(childResults).toEqualUnsorted([])
    // })

    it('empty array', async () => {
      await expect(repository.deleteMany([])).not.toBeRejected()
    })
  })
})

function entryToResult(entires: TrackedTxConfigEntry[]) {
  return entires.flatMap(toNewRow).map(toRecord)
}

function toRecord(entry: TrackedTxsConfigRow): TrackedTxsConfigRecord {
  return {
    id: TrackedTxsId.unsafe(entry.id),
    subtype: entry.subtype
      ? TrackedTxsConfigSubtype.parse(entry.subtype)
      : undefined,
    type: TrackedTxsConfigType.parse(entry.type),
    projectId: ProjectId(entry.project_id),
    sinceTimestamp: UnixTime.fromDate(entry.since_timestamp),
    untilTimestamp: entry.until_timestamp
      ? UnixTime.fromDate(entry.until_timestamp)
      : undefined,
    lastSyncedTimestamp: undefined,
    debugInfo: expect.a(String),
  }
}
function makeTrackedTxsFunctionCall(
  props?: Partial<TrackedTxFunctionCallConfig>,
): TrackedTxFunctionCallConfig {
  return {
    formula: 'functionCall',
    address: EthereumAddress.random(),
    projectId: ProjectId('random-project-id'),
    selector: '0x1234123412',
    sinceTimestamp: START,
    uses: [
      {
        id: TrackedTxsId(['0x']),
        type: 'liveness',
        subType: 'batchSubmissions',
      },
      {
        id: TrackedTxsId(['0x012']),
        type: 'liveness',
        subType: 'stateUpdates',
      },
    ],
    ...props,
  }
}
