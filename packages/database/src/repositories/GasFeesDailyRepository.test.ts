import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type GasFeesDailyRecord,
  GasFeesDailyRepository,
} from './GasFeesDailyRepository'

describeDatabase(GasFeesDailyRepository.name, (db) => {
  const repository = db.gasFeesDaily

  afterEach(async () => {
    await repository.deleteAll()
  })

  it('upserts by chain and day, keeping missing values null', async () => {
    await repository.upsertMany([record('ethereum', 1), record('base', 1)])
    const updated = {
      ...record('ethereum', 1),
      totalFeeUsd: null,
      baseFeeNative: null,
    }
    await repository.upsertMany([updated, record('ethereum', 2)])

    expect(
      await repository.getInRange(UnixTime(0), UnixTime(10 * UnixTime.DAY)),
    ).toEqual([record('base', 1), updated, record('ethereum', 2)])
  })

  it('deletes the days after a timestamp', async () => {
    await repository.upsertMany([record('ethereum', 1), record('ethereum', 2)])

    expect(await repository.deleteAfter(UnixTime(UnixTime.DAY))).toEqual(1)
  })
})

function record(chain: string, day: number): GasFeesDailyRecord {
  return {
    timestamp: UnixTime(day * UnixTime.DAY),
    chain,
    txCount: 1_500_000,
    totalFeeNative: 31.4,
    totalFeeUsd: 110_000.5,
    l1FeeNative: 0,
    blobFeeNative: 0.2,
    baseFeeNative: 24.7,
    gasUsed: 108_000_000_000,
    medianFeeUsd: 0.021,
  }
}
