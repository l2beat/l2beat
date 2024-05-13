import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../../../test/database'
import {
  L2CostsPricesRecord,
  L2CostsPricesRepository,
} from './L2CostsPricesRepository'

const NOW = UnixTime.now()
describeDatabase(L2CostsPricesRepository.name, (database) => {
  const repository = new L2CostsPricesRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(L2CostsPricesRepository.prototype.addMany.name, async () => {
    const records = [record({ timestamp: NOW.add(-1, 'hours') }), record()]

    await repository.addMany(records)

    const result = await repository.getAll()
    expect(result).toEqual(records)
  })

  it(L2CostsPricesRepository.prototype.findByTimestampRange.name, async () => {
    const records = [
      record({ timestamp: NOW.add(-2, 'hours') }),
      record({ timestamp: NOW.add(-1, 'hours') }),
      record(),
      record({ timestamp: NOW.add(1, 'hours') }),
      record({ timestamp: NOW.add(2, 'hours') }),
    ]
    await repository.addMany(records)

    const result = await repository.findByTimestampRange(
      NOW.add(-1, 'hours'),
      NOW.add(1, 'hours'),
    )
    expect(result).toEqual([records[1], records[2], records[3]])
  })

  it(L2CostsPricesRepository.prototype.deleteAfter.name, async () => {
    const records = [
      record({ timestamp: NOW.add(-1, 'hours') }),
      record(),
      record({ timestamp: NOW.add(1, 'hours') }),
    ]
    await repository.addMany(records)

    await repository.deleteAfter(NOW)

    const result = await repository.getAll()
    expect(result).toEqual([records[0], records[1]])
  })
})

function record(data?: Partial<L2CostsPricesRecord>): L2CostsPricesRecord {
  return {
    timestamp: NOW,
    priceUsd: 3000,
    ...data,
  }
}
