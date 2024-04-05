import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import {
  IndexerConfigurationRecord,
  IndexerConfigurationRepository,
} from '../../../tools/uif/IndexerConfigurationRepository'
import { AmountRecord, AmountRepository } from './AmountRepository'

describeDatabase(AmountRepository.name, (database) => {
  const CONFIGURATIONS = [
    mock({ id: '1' }),
    mock({ id: '2' }),
    mock({ id: '3' }),
  ]

  const repository = new AmountRepository(database, Logger.SILENT)
  const configurationsRepository = new IndexerConfigurationRepository(
    database,
    Logger.SILENT,
  )

  beforeEach(async () => {
    await configurationsRepository.addManySavedConfigurations(CONFIGURATIONS)
  })

  afterEach(async () => {
    await configurationsRepository.deleteAll()
  })

  describe(AmountRepository.prototype.addMany.name, () => {
    it('adds new rows', async () => {
      const newRows = [
        {
          configurationId: CONFIGURATIONS[0].id,
          timestamp: UnixTime.ZERO,
          amount: 111n,
        },
        {
          configurationId: CONFIGURATIONS[1].id,
          timestamp: UnixTime.ZERO,
          amount: 111n,
        },
      ]
      await repository.addMany(newRows)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted(newRows)
    })

    it('empty array', async () => {
      await expect(repository.addMany([])).not.toBeRejected()
    })

    it('performs batch insert when more than 10k records', async () => {
      const records: AmountRecord[] = []
      for (let i = 5; i < 15_000; i++) {
        records.push({
          configurationId: CONFIGURATIONS[0].id,
          timestamp: new UnixTime(i),
          amount: 111n,
        })
      }
      await expect(repository.addMany(records)).not.toBeRejected()
    })
  })

  // #region methods used only in tests
  it(AmountRepository.prototype.deleteAll.name, async () => {
    await repository.addMany([
      {
        configurationId: CONFIGURATIONS[0].id,
        timestamp: UnixTime.ZERO,
        amount: 111n,
      },
    ])

    await repository.deleteAll()

    const results = await repository.getAll()

    expect(results).toEqual([])
  })
  // #endregion
})

function mock(
  record?: Partial<IndexerConfigurationRecord>,
): IndexerConfigurationRecord {
  return {
    id: 'a',
    indexerId: 'indexer',
    currentHeight: null,
    minHeight: 0,
    maxHeight: null,
    properties: '',
    ...record,
  }
}
