import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type GasFeesTipHourlyRecord,
  GasFeesTipHourlyRepository,
} from './GasFeesTipHourlyRepository'

describeDatabase(GasFeesTipHourlyRepository.name, (db) => {
  const repository = db.gasFeesTipHourly

  afterEach(async () => {
    await repository.deleteAll()
  })

  it('upserts by hour and reads a range oldest first', async () => {
    await repository.upsertMany([hour(2, 0.1), hour(1, 0.1)])
    await repository.upsertMany([hour(2, 0.2)])

    expect(
      await repository.getInRange(UnixTime(0), UnixTime(2 * UnixTime.HOUR)),
    ).toEqual([hour(1, 0.1), hour(2, 0.2)])
  })

  it('deletes the hours after a height', async () => {
    await repository.upsertMany([hour(1, 0.1), hour(2, 0.1), hour(3, 0.1)])

    await repository.deleteAfter(UnixTime(2 * UnixTime.HOUR))

    expect(
      await repository.getInRange(UnixTime(0), UnixTime(UnixTime.DAY)),
    ).toEqual([hour(1, 0.1), hour(2, 0.1)])
  })
})

function hour(n: number, fastTipGwei: number): GasFeesTipHourlyRecord {
  return {
    timestamp: UnixTime(n * UnixTime.HOUR),
    blockNumber: n * 300,
    slowTipGwei: 0.0000029,
    mediumTipGwei: 0.0064,
    fastTipGwei,
    ethUsd: 3456.78,
  }
}
