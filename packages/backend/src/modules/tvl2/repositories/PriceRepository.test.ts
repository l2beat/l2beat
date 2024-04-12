import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import { PriceRecord, PriceRepository } from './PriceRepository'

describeDatabase(PriceRepository.name, (database) => {
  const repository = new PriceRepository(database, Logger.SILENT)

  afterEach(async () => {
    await repository.deleteAll()
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

  describe(PriceRepository.prototype.deleteAfterExclusive.name, () => {
    it('deletes records after the given timestamp', async () => {
      await repository.addMany([
        saved('a', new UnixTime(1), 1),
        saved('a', new UnixTime(2), 2),
        saved('a', new UnixTime(3), 3),
      ])

      await repository.deleteAfterExclusive('a'.repeat(12), new UnixTime(1))

      const results = await repository.getAll()
      expect(results).toEqual([saved('a', new UnixTime(1), 1)])
    })

    it('deletes only for specified ids', async () => {
      await repository.addMany([
        saved('a', new UnixTime(1), 1),
        saved('b', new UnixTime(1), 1),
      ])

      await repository.deleteAfterExclusive('a'.repeat(12), new UnixTime(0))

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
})

function saved(id: string, timestamp: UnixTime, priceUsd: number): PriceRecord {
  return {
    configId: id.repeat(12),
    timestamp,
    priceUsd,
  }
}
