import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { Logger } from '@l2beat/backend-tools'
import { describeDatabase } from '../../../test/database'
import { testDeletingArchivedRecords } from '../utils/deleteArchivedRecords.test'
import { AmountRepository } from './AmountRepository'

describeDatabase(AmountRepository.name, (knex, kysely) => {
  const oldRepo = new AmountRepository(knex, Logger.SILENT)
  const newRepo = kysely.amount

  suite(oldRepo)
  suite(newRepo)

  function suite(amountRepository: typeof oldRepo | typeof newRepo) {
    describe(AmountRepository.prototype.getByConfigIdsInRange.name, () => {
      it('gets by ids in inclusive range', async () => {
        await amountRepository.addMany([
          amount('a', new UnixTime(50), 100n),
          amount('a', new UnixTime(100), 100n),
          amount('b', new UnixTime(100), 100n),
          amount('c', new UnixTime(100), 100n),
          amount('a', new UnixTime(200), 100n),
          amount('b', new UnixTime(200), 100n),
          amount('c', new UnixTime(200), 100n),
          amount('a', new UnixTime(300), 100n),
          amount('b', new UnixTime(300), 100n),
          amount('c', new UnixTime(300), 100n),
          amount('a', new UnixTime(400), 100n),
        ])

        const result = await amountRepository.getByConfigIdsInRange(
          ['a'.repeat(12), 'b'.repeat(12)],
          new UnixTime(100),
          new UnixTime(300),
        )

        expect(result).toEqual([
          amount('a', new UnixTime(100), 100n),
          amount('b', new UnixTime(100), 100n),
          amount('a', new UnixTime(200), 100n),
          amount('b', new UnixTime(200), 100n),
          amount('a', new UnixTime(300), 100n),
          amount('b', new UnixTime(300), 100n),
        ])
      })
    })

    describe(AmountRepository.prototype.addMany.name, () => {
      it('adds new rows', async () => {
        await amountRepository.addMany([
          amount('a', UnixTime.ZERO, 111n),
          amount('b', UnixTime.ZERO, 222n),
        ])

        const results = await amountRepository.getAll()
        expect(results).toEqualUnsorted([
          amount('a', UnixTime.ZERO, 111n),
          amount('b', UnixTime.ZERO, 222n),
        ])
      })

      it('empty array', async () => {
        await expect(amountRepository.addMany([])).not.toBeRejected()
      })

      it('performs batch insert when more than 10k records', async () => {
        const records = []
        for (let i = 5; i < 15_000; i++) {
          records.push(amount('a', new UnixTime(i), 111n))
        }

        await expect(amountRepository.addMany(records)).not.toBeRejected()
      })
    })

    describe(AmountRepository.prototype.deleteByConfigInTimeRange.name, () => {
      it('deletes data in range for matching config', async () => {
        await amountRepository.addMany([
          amount('b', new UnixTime(1), 0n),
          amount('b', new UnixTime(2), 0n),
          amount('b', new UnixTime(3), 0n),
        ])

        await amountRepository.deleteByConfigInTimeRange(
          'b'.repeat(12),
          new UnixTime(1),
          new UnixTime(2),
        )

        const results = await amountRepository.getAll()
        expect(results).toEqualUnsorted([amount('b', new UnixTime(3), 0n)])
      })
      it('does not delete data if matching config not found', async () => {
        await amountRepository.addMany([amount('b', new UnixTime(1), 0n)])

        await amountRepository.deleteByConfigInTimeRange(
          'c',
          new UnixTime(1),
          new UnixTime(2),
        )

        const results = await amountRepository.getAll()
        expect(results).toEqualUnsorted([amount('b', new UnixTime(1), 0n)])
      })
    })

    describe(AmountRepository.prototype.deleteByConfigAfter.name, () => {
      it('deletes data in range for matching config', async () => {
        await amountRepository.addMany([
          amount('b', new UnixTime(1), 0n),
          amount('b', new UnixTime(2), 0n),
          amount('b', new UnixTime(3), 0n),
        ])

        await amountRepository.deleteByConfigAfter(
          'b'.repeat(12),
          new UnixTime(1),
        )

        const results = await amountRepository.getAll()
        expect(results).toEqualUnsorted([amount('b', new UnixTime(1), 0n)])
      })

      it('does not delete data if matching config not found', async () => {
        await amountRepository.addMany([amount('b', new UnixTime(2), 0n)])

        await amountRepository.deleteByConfigAfter('c', new UnixTime(1))

        const results = await amountRepository.getAll()
        expect(results).toEqualUnsorted([amount('b', new UnixTime(2), 0n)])
      })
    })

    // TvlCleaner test
    testDeletingArchivedRecords(amountRepository, (timestamp) =>
      amount('a', timestamp, 0n),
    )

    // #region methods used only in tests
    it(AmountRepository.prototype.deleteAll.name, async () => {
      await amountRepository.addMany([amount('a', UnixTime.ZERO, 111n)])
      await amountRepository.deleteAll()
      const results = await amountRepository.getAll()
      expect(results).toEqual([])
    })
    // #endregion

    afterEach(async () => {
      await amountRepository.deleteAll()
    })
  }
})

function amount(configId: string, timestamp: UnixTime, amount: bigint) {
  return {
    configId: configId.repeat(12),
    timestamp,
    amount,
  }
}
