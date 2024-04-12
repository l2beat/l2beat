import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import { AmountRepository } from './AmountRepository'

describeDatabase(AmountRepository.name, (database) => {
  const amountRepository = new AmountRepository(database, Logger.SILENT)

  afterEach(async () => {
    await amountRepository.deleteAll()
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

  // #region methods used only in tests
  it(AmountRepository.prototype.deleteAll.name, async () => {
    await amountRepository.addMany([amount('a', UnixTime.ZERO, 111n)])
    await amountRepository.deleteAll()
    const results = await amountRepository.getAll()
    expect(results).toEqual([])
  })
  // #endregion
})

function amount(configId: string, timestamp: UnixTime, amount: bigint) {
  return {
    configId: configId.repeat(12),
    timestamp,
    amount,
  }
}
