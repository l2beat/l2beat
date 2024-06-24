import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import { testDeletingArchivedRecords } from '../utils/deleteArchivedRecords.test'
import { PriceRecord, PriceRepository } from './PriceRepository'

describeDatabase(PriceRepository.name, (knex, kysely) => {
  const oldRepo = new PriceRepository(knex, Logger.SILENT)
  const newRepo = kysely.price

  suite(oldRepo)
  suite(newRepo)

  function suite(repository: typeof oldRepo | typeof newRepo) {
    afterEach(async () => {
      await repository.deleteAll()
    })

    describe(PriceRepository.prototype.getByConfigId.name, () => {
      it('gets by id', async () => {
        const record = saved('a', UnixTime.ZERO, 1)
        await repository.addMany([record, saved('b', UnixTime.ZERO, 2)])
        const result = await repository.getByConfigId(record.configId)
        expect(result).toEqual([record])
      })
    })

    describe(PriceRepository.prototype.getByConfigIdsInRange.name, () => {
      it('gets by ids in inclusive range', async () => {
        await repository.addMany([
          saved('a', new UnixTime(50), 100),
          saved('a', new UnixTime(100), 100),
          saved('b', new UnixTime(100), 100),
          saved('c', new UnixTime(100), 100),
          saved('a', new UnixTime(200), 100),
          saved('b', new UnixTime(200), 100),
          saved('c', new UnixTime(200), 100),
          saved('a', new UnixTime(300), 100),
          saved('b', new UnixTime(300), 100),
          saved('c', new UnixTime(300), 100),
          saved('a', new UnixTime(400), 100),
        ])

        const result = await repository.getByConfigIdsInRange(
          ['a'.repeat(12), 'b'.repeat(12)],
          new UnixTime(100),
          new UnixTime(300),
        )

        expect(result).toEqual([
          saved('a', new UnixTime(100), 100),
          saved('b', new UnixTime(100), 100),
          saved('a', new UnixTime(200), 100),
          saved('b', new UnixTime(200), 100),
          saved('a', new UnixTime(300), 100),
          saved('b', new UnixTime(300), 100),
        ])
      })
    })

    describe(PriceRepository.prototype.addMany.name, () => {
      it('adds new rows', async () => {
        await repository.addMany([
          saved('a', UnixTime.ZERO, 1),
          saved('b', UnixTime.ZERO, 2),
        ])

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([
          saved('a', UnixTime.ZERO, 1),
          saved('b', UnixTime.ZERO, 2),
        ])
      })

      it('empty array', async () => {
        await expect(repository.addMany([])).not.toBeRejected()
      })

      it('performs batch insert when more than 10k records', async () => {
        const records: PriceRecord[] = []
        for (let i = 5; i < 15_000; i++) {
          records.push(saved('a', new UnixTime(i), i))
        }
        await expect(repository.addMany(records)).not.toBeRejected()
      })
    })

    describe(PriceRepository.prototype.deleteByConfigInTimeRange.name, () => {
      it('deletes records after the given timestamp', async () => {
        await repository.addMany([
          saved('a', new UnixTime(1), 1),
          saved('a', new UnixTime(2), 2),
          saved('a', new UnixTime(3), 3),
        ])

        await repository.deleteByConfigInTimeRange(
          'a'.repeat(12),
          new UnixTime(2),
          new UnixTime(3),
        )

        const results = await repository.getAll()
        expect(results).toEqual([saved('a', new UnixTime(1), 1)])
      })

      it('deletes only for specified ids', async () => {
        await repository.addMany([
          saved('a', new UnixTime(1), 1),
          saved('b', new UnixTime(1), 1),
        ])

        await repository.deleteByConfigInTimeRange(
          'a'.repeat(12),
          new UnixTime(0),
          new UnixTime(1),
        )

        const results = await repository.getAll()
        expect(results).toEqual([saved('b', new UnixTime(1), 1)])
      })
    })

    it(PriceRepository.prototype.deleteAll.name, async () => {
      await repository.addMany([saved('a', UnixTime.ZERO, 1)])

      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toEqual([])
    })

    // TvlCleaner test
    testDeletingArchivedRecords(repository, (timestamp) =>
      saved('a', timestamp, 1),
    )
  }
})

function saved(id: string, timestamp: UnixTime, priceUsd: number): PriceRecord {
  return {
    configId: id.repeat(12),
    timestamp,
    priceUsd,
  }
}
