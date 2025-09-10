import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type L2CostPriceRecord,
  L2CostPriceRepository,
} from './L2CostPriceRepository'

const NOW = UnixTime.now()
describeDatabase(L2CostPriceRepository.name, (db) => {
  const repository = db.l2CostPrice

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(L2CostPriceRepository.prototype.insertMany.name, async () => {
    const records = [record({ timestamp: NOW - 1 * UnixTime.HOUR }), record()]

    await repository.insertMany(records)

    const result = await repository.getAll()
    expect(result).toEqual(records)
  })

  it(L2CostPriceRepository.prototype.getByTimestampRange.name, async () => {
    const records = [
      record({ timestamp: NOW - 2 * UnixTime.HOUR }),
      record({ timestamp: NOW - 1 * UnixTime.HOUR }),
      record(),
      record({ timestamp: NOW + 1 * UnixTime.HOUR }),
      record({ timestamp: NOW + 2 * UnixTime.HOUR }),
    ]
    await repository.insertMany(records)

    const result = await repository.getByTimestampRange(
      NOW - 1 * UnixTime.HOUR,
      NOW + 1 * UnixTime.HOUR,
    )
    expect(result).toEqual([records[1]!, records[2]!, records[3]!])
  })

  it(L2CostPriceRepository.prototype.deleteAfter.name, async () => {
    const records = [
      record({ timestamp: NOW - 1 * UnixTime.HOUR }),
      record(),
      record({ timestamp: NOW + 1 * UnixTime.HOUR }),
    ]
    await repository.insertMany(records)

    await repository.deleteAfter(NOW)

    const result = await repository.getAll()
    expect(result).toEqual([records[0]!, records[1]!])
  })
})

function record(data?: Partial<L2CostPriceRecord>): L2CostPriceRecord {
  return {
    timestamp: NOW,
    priceUsd: 3000,
    ...data,
  }
}
