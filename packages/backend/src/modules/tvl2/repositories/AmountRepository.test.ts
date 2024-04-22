import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import {
  IndexerConfigurationRecord,
  IndexerConfigurationRepository,
} from '../../../tools/uif/IndexerConfigurationRepository'
import { AmountRepository } from './AmountRepository'

describeDatabase(AmountRepository.name, (database) => {
  const configurationsRepository = new IndexerConfigurationRepository(
    database,
    Logger.SILENT,
  )
  const amountRepository = new AmountRepository(database, Logger.SILENT)
  const { IDS } = setupConfigurations(configurationsRepository)

  describe(AmountRepository.prototype.addMany.name, () => {
    it('adds new rows', async () => {
      await amountRepository.addMany([
        amount(IDS[0], UnixTime.ZERO, 111n),
        amount(IDS[1], UnixTime.ZERO, 222n),
      ])

      const results = await amountRepository.getAll()
      expect(results).toEqualUnsorted([
        amount(IDS[0], UnixTime.ZERO, 111n),
        amount(IDS[1], UnixTime.ZERO, 222n),
      ])
    })

    it('empty array', async () => {
      await expect(amountRepository.addMany([])).not.toBeRejected()
    })

    it('performs batch insert when more than 10k records', async () => {
      const records = []
      for (let i = 5; i < 15_000; i++) {
        records.push(amount(IDS[0], new UnixTime(i), 111n))
      }

      await expect(amountRepository.addMany(records)).not.toBeRejected()
    })
  })

  describe(AmountRepository.prototype.deleteByConfigInTimeRange.name, () => {
    it('deletes data in range for matching config', async () => {
      await amountRepository.addMany([
        amount(IDS[1], new UnixTime(1), 0n),
        amount(IDS[1], new UnixTime(2), 0n),
        amount(IDS[1], new UnixTime(3), 0n),
      ])

      await amountRepository.deleteByConfigInTimeRange(
        IDS[1],
        new UnixTime(1),
        new UnixTime(2),
      )

      const results = await amountRepository.getAll()
      expect(results).toEqualUnsorted([amount(IDS[1], new UnixTime(3), 0n)])
    })
    it('does not delete data if matching config not found', async () => {
      await amountRepository.addMany([amount(IDS[1], new UnixTime(1), 0n)])

      await amountRepository.deleteByConfigInTimeRange(
        IDS[2],
        new UnixTime(1),
        new UnixTime(2),
      )

      const results = await amountRepository.getAll()
      expect(results).toEqualUnsorted([amount(IDS[1], new UnixTime(1), 0n)])
    })
  })

  // #region methods used only in tests
  it(AmountRepository.prototype.deleteAll.name, async () => {
    await amountRepository.addMany([amount(IDS[0], UnixTime.ZERO, 111n)])
    await amountRepository.deleteAll()
    const results = await amountRepository.getAll()
    expect(results).toEqual([])
  })
  // #endregion
})

function amount(configId: string, timestamp: UnixTime, amount: bigint) {
  return {
    configId,
    timestamp,
    amount,
  }
}

function setupConfigurations(
  configurationsRepository: IndexerConfigurationRepository,
) {
  const CONFIGS = [
    config('a', 0, null, null),
    config('b', 0, null, null),
    config('c', 0, null, null),
  ]
  const IDS = CONFIGS.map((c) => c.id)

  beforeEach(async () => {
    await configurationsRepository.addOrUpdateMany(CONFIGS)
  })

  afterEach(async () => {
    await configurationsRepository.deleteAll()
  })
  return { CONFIGS, IDS }
}

function config(
  id: string,
  minHeight: number,
  maxHeight: number | null,
  currentHeight: number | null,
): IndexerConfigurationRecord {
  return {
    id: id.repeat(12),
    indexerId: 'indexer',
    currentHeight,
    minHeight,
    maxHeight,
    properties: '',
  }
}
