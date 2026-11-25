import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type EthereumSupplyDailyRecord,
  EthereumSupplyDailyRepository,
} from './EthereumSupplyDailyRepository'

describeDatabase(EthereumSupplyDailyRepository.name, (db) => {
  const repository = db.ethereumSupplyDaily

  afterEach(async () => {
    await repository.deleteAll()
  })

  it('upserts by day', async () => {
    await repository.upsertMany([record(1), record(2)])
    const updated = { ...record(1), supply: 120_712_345.5 }
    await repository.upsertMany([updated])

    expect(await repository.getAll()).toEqual([updated, record(2)])
  })

  it('gets the days in a range, oldest first', async () => {
    await repository.upsertMany([record(3), record(1), record(2), record(5)])

    expect(
      await repository.getInRange(
        UnixTime(UnixTime.DAY),
        UnixTime(3 * UnixTime.DAY),
      ),
    ).toEqual([record(1), record(2), record(3)])
  })

  it('deletes the days after a timestamp', async () => {
    await repository.upsertMany([record(1), record(2), record(3)])

    expect(await repository.deleteAfter(UnixTime(UnixTime.DAY))).toEqual(2)
    expect(await repository.getAll()).toEqual([record(1)])
  })
})

function record(day: number): EthereumSupplyDailyRecord {
  return {
    timestamp: UnixTime(day * UnixTime.DAY),
    supply: 120_000_000 + day * 1_000,
  }
}
