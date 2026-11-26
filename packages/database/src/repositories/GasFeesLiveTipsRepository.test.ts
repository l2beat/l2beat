import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type GasFeesLiveTipsRecord,
  GasFeesLiveTipsRepository,
} from './GasFeesLiveTipsRepository'

describeDatabase(GasFeesLiveTipsRepository.name, (db) => {
  const repository = db.gasFeesLiveTips

  afterEach(async () => {
    await repository.deleteAll()
  })

  it('keeps only the newest reading', async () => {
    await repository.replace(reading(100))
    await repository.replace(reading(101))

    expect(await repository.find()).toEqual(reading(101))
  })
})

function reading(blockNumber: number): GasFeesLiveTipsRecord {
  return {
    blockNumber,
    slowTipGwei: 0.0000029,
    mediumTipGwei: 0.0064,
    fastTipGwei: 0.099,
    ethUsd: 3456.78,
    updatedAt: UnixTime(blockNumber * 12),
  }
}
