import { Logger } from '@l2beat/backend-tools'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import {
  AmountConfigurationRecord,
  AmountConfigurationRepository,
} from './AmountConfigurationRepository'
import { AmountRecord, AmountRepository } from './AmountRepository'

describeDatabase(AmountRepository.name, (database) => {
  const configurationRepository = new AmountConfigurationRepository(
    database,
    Logger.SILENT,
  )
  const repository = new AmountRepository(database, Logger.SILENT)

  let IDS: number[] = []

  beforeEach(async () => {
    IDS = await configurationRepository.addMany([mock(), mock()])
  })

  afterEach(async () => {
    await repository.deleteAll()
    await configurationRepository.deleteAll()
  })

  describe(AmountRepository.prototype.addMany.name, () => {
    it('adds new rows', async () => {
      const newRows = [
        {
          configurationId: IDS[0],
          timestamp: UnixTime.ZERO,
          amount: 111n,
        },
        {
          configurationId: IDS[1],
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
          configurationId: IDS[0],
          timestamp: new UnixTime(i),
          amount: 111n,
        })
      }
      await expect(repository.addMany(records)).not.toBeRejected()
    })
  })

  it(AmountRepository.prototype.deleteAll.name, async () => {
    await repository.addMany([
      {
        configurationId: IDS[0],
        timestamp: UnixTime.ZERO,
        amount: 111n,
      },
    ])

    await repository.deleteAll()

    const results = await repository.getAll()

    expect(results).toEqual([])
  })
})

function mock(
  record?: Partial<AmountConfigurationRecord>,
): Omit<AmountConfigurationRecord, 'id'> {
  return {
    projectId: ProjectId('project'),
    indexerId: 'indexer',
    chain: 'chain',
    address: EthereumAddress.random(),
    origin: 'native',
    type: 'circulatingSupply',
    includeInTotal: true,
    ...record,
  }
}
