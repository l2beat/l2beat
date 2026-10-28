import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type EthereumStakingDailyRecord,
  EthereumStakingDailyRepository,
} from './EthereumStakingDailyRepository'

describeDatabase(EthereumStakingDailyRepository.name, (db) => {
  const repository = db.ethereumStakingDaily

  afterEach(async () => {
    await repository.deleteAll()
  })

  it('upserts by day, keeping wei amounts exact', async () => {
    await repository.upsertMany([record(1), record(2)])
    const updated = {
      ...record(1),
      // 34M ETH in wei does not fit a double.
      totalBalance: 34_000_000_123_456_789_012_345_678n,
      pendingDeposits: 7n,
    }
    await repository.upsertMany([updated])

    expect(await repository.getAll()).toEqual([updated, record(2)])
  })

  it('deletes the days after a timestamp', async () => {
    await repository.upsertMany([record(1), record(2), record(3)])

    expect(await repository.deleteAfter(UnixTime(1 * UnixTime.DAY))).toEqual(2)
    expect(await repository.getAll()).toEqual([record(1)])
  })
})

function record(day: number): EthereumStakingDailyRecord {
  return {
    timestamp: UnixTime(day * UnixTime.DAY),
    slot: day * 7200 - 1,
    totalBalance: 10n ** 25n,
    validatorCount: 1_000_000,
    pendingDeposits: null,
    withdrawals: 10n ** 21n,
    deposits: 10n ** 20n,
    executionRewards: 10n ** 19n,
    blockCount: 7_150,
  }
}
