import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import { testDeletingArchivedRecords } from '../utils/deleteArchivedRecords.test'
import { ValueRecord, ValueRepository } from './ValueRepository'

describeDatabase(ValueRepository.name, (knex, kysely) => {
  const oldRepo = new ValueRepository(knex, Logger.SILENT)
  const newRepo = kysely.value

  suite(oldRepo)
  suite(newRepo)

  function suite(repository: typeof oldRepo | typeof newRepo) {
    afterEach(async () => {
      await repository.deleteAll()
    })

    describe(ValueRepository.prototype.addOrUpdateMany.name, () => {
      it('adds new rows', async () => {
        await repository.addOrUpdateMany([
          saved('a', UnixTime.ZERO, 'data_src', 1, 2, 3),
          saved('b', UnixTime.ZERO, 'data_src', 2, 3, 4),
        ])

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([
          saved('a', UnixTime.ZERO, 'data_src', 1, 2, 3),
          saved('b', UnixTime.ZERO, 'data_src', 2, 3, 4),
        ])
      })

      it('upserts rows', async () => {
        await repository.addOrUpdateMany([
          saved('a', UnixTime.ZERO, 'data_src', 1, 2, 3),
          saved('b', UnixTime.ZERO, 'data_src', 2, 3, 4),
        ])

        await repository.addOrUpdateMany([
          saved('a', UnixTime.ZERO, 'data_src', 11, 22, 33),
          saved('b', UnixTime.ZERO, 'data_src', 22, 33, 44),
        ])

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([
          saved('a', UnixTime.ZERO, 'data_src', 11, 22, 33),
          saved('b', UnixTime.ZERO, 'data_src', 22, 33, 44),
        ])
      })

      it('empty array', async () => {
        await expect(repository.addOrUpdateMany([])).not.toBeRejected()
      })

      it('performs batch insert with many records', async () => {
        const records: ValueRecord[] = []
        for (let i = 5; i < 5_000; i++) {
          records.push(saved('a', new UnixTime(i), 'data_src', i, i * 2, i + 1))
        }
        await expect(repository.addOrUpdateMany(records)).not.toBeRejected()
      })
    })

    it(ValueRepository.prototype.deleteAll.name, async () => {
      await repository.addOrUpdateMany([
        saved('a', UnixTime.ZERO, 'data_src', 1, 2, 3),
      ])

      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toEqual([])
    })

    // TvlCleaner test
    testDeletingArchivedRecords(repository, (timestamp) =>
      saved('a', timestamp, 'data_src', 1, 2, 3),
    )
  }
})

function saved(
  id: string,
  timestamp: UnixTime,
  dataSource: string,
  canonical: number,
  external: number,
  native: number,
): ValueRecord {
  return {
    projectId: ProjectId(id),
    timestamp,
    dataSource,
    canonical: BigInt(canonical),
    canonicalForTotal: BigInt(canonical),
    external: BigInt(external),
    externalForTotal: BigInt(external),
    native: BigInt(native),
    nativeForTotal: BigInt(native),
  }
}
