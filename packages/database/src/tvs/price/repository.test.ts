import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import type { TvsPriceRecord } from './entity'
import { TvsPriceRepository } from './repository'

describeDatabase(TvsPriceRepository.name, (db) => {
  const repository = db.tvsPrice

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(TvsPriceRepository.prototype.insertMany.name, () => {
    it('adds new rows', async () => {
      await repository.insertMany([saved('a', 0, 1), saved('b', 0, 2)])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([saved('a', 0, 1), saved('b', 0, 2)])
    })

    it('empty array', async () => {
      await expect(repository.insertMany([])).not.toBeRejected()
    })

    it('performs batch insert when more than 10k records', async () => {
      const records: TvsPriceRecord[] = []
      for (let i = 5; i < 15_000; i++) {
        records.push(saved('a', UnixTime(i), i))
      }
      await expect(repository.insertMany(records)).not.toBeRejected()
    })
  })

  describe(TvsPriceRepository.prototype.deleteByConfigInTimeRange.name, () => {
    it('deletes records after the given timestamp', async () => {
      await repository.insertMany([
        saved('a', UnixTime(1), 1),
        saved('a', UnixTime(2), 2),
        saved('a', UnixTime(3), 3),
      ])

      await repository.deleteByConfigInTimeRange(
        'a'.repeat(12),
        UnixTime(2),
        UnixTime(3),
      )

      const results = await repository.getAll()
      expect(results).toEqual([saved('a', UnixTime(1), 1)])
    })

    it('deletes only for specified ids', async () => {
      await repository.insertMany([
        saved('a', UnixTime(1), 1),
        saved('b', UnixTime(1), 1),
      ])

      await repository.deleteByConfigInTimeRange('a'.repeat(12), 0, UnixTime(1))

      const results = await repository.getAll()
      expect(results).toEqual([saved('b', UnixTime(1), 1)])
    })
  })

  it(TvsPriceRepository.prototype.deleteAll.name, async () => {
    await repository.insertMany([saved('a', 0, 1)])

    await repository.deleteAll()

    const results = await repository.getAll()

    expect(results).toEqual([])
  })
})

function saved(
  priceId: string,
  timestamp: UnixTime,
  priceUsd: number,
): TvsPriceRecord {
  return {
    configurationId: priceId.repeat(12),
    timestamp,
    priceUsd,
    priceId,
  }
}
