import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type GasFeesTipPayersDailyRecord,
  GasFeesTipPayersDailyRepository,
} from './GasFeesTipPayersDailyRepository'

describeDatabase(GasFeesTipPayersDailyRepository.name, (db) => {
  const repository = db.gasFeesTipPayersDaily

  afterEach(async () => {
    await repository.deleteAll()
  })

  it('upserts by day and reads the groups back', async () => {
    await repository.upsert(record(1, 600))
    await repository.upsert(record(1, 700))
    await repository.upsert(record(2, 600))

    expect(
      await repository.getInRange(UnixTime(0), UnixTime(10 * UnixTime.DAY)),
    ).toEqual([record(1, 700), record(2, 600)])
  })

  it('stores a missing day without figures, also over a complete one', async () => {
    const missing = {
      timestamp: UnixTime(UnixTime.DAY),
      status: 'missing' as const,
    }
    await repository.upsert(record(1, 600))
    await repository.upsert(missing)

    expect(
      await repository.getInRange(UnixTime(0), UnixTime(10 * UnixTime.DAY)),
    ).toEqual([missing])
  })
})

function record(day: number, lowTxCount: number): GasFeesTipPayersDailyRecord {
  const group = (txCount: number) => ({ txCount, tipEth: 1.5 })
  return {
    timestamp: UnixTime(day * UnixTime.DAY),
    status: 'complete',
    ethUsd: 4000,
    fastTipGwei: 0.1,
    low: group(lowTxCount),
    middle: group(300),
    high: group(100),
    roundTipTxCount: 50,
    atFastTipEth: 0.5,
    nonOrdinary: group(10),
  }
}
