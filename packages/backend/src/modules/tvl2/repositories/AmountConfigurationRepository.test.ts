import { Logger } from '@l2beat/backend-tools'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import {
  AmountConfigurationRecord,
  AmountConfigurationRepository,
} from './AmountConfigurationRepository'

describeDatabase(AmountConfigurationRepository.name, (database) => {
  const repository = new AmountConfigurationRepository(database, Logger.SILENT)

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(AmountConfigurationRepository.prototype.addMany.name, () => {
    it('adds new rows', async () => {
      const newRows = [
        {
          ...mock({ indexerId: 'a' }),
        },
        {
          ...mock({ indexerId: 'b' }),
        },
      ]
      const ids = await repository.addMany(newRows)

      const results = await repository.getAll()

      expect(results).toEqualUnsorted(
        newRows.map((r, i) => ({ id: ids[i], ...r })),
      )
    })

    it('empty array', async () => {
      await expect(repository.addMany([])).not.toBeRejected()
    })

    it('performs batch insert when more than 10k records', async () => {
      const records: Omit<AmountConfigurationRecord, 'id'>[] = []
      for (let i = 5; i < 15_000; i++) {
        records.push({
          ...mock({ indexerId: i.toString() }),
        })
      }
      await expect(repository.addMany(records)).not.toBeRejected()
    })
  })

  it(AmountConfigurationRepository.prototype.getByIndexerId.name, async () => {
    const newRows = [
      {
        ...mock({ indexerId: 'a', projectId: ProjectId('a') }),
      },
      {
        ...mock({ indexerId: 'a', projectId: ProjectId('b') }),
      },
      {
        ...mock({ indexerId: 'b', projectId: ProjectId('b') }),
      },
    ]
    const ids = await repository.addMany(newRows)

    const results = await repository.getByIndexerId('a')

    expect(results).toEqualUnsorted(
      newRows.map((r, i) => ({ id: ids[i], ...r })).slice(0, 2),
    )
  })

  it(AmountConfigurationRepository.prototype.deleteAll.name, async () => {
    await repository.addMany([mock()])

    await repository.deleteAll()

    const results = await repository.getAll()

    expect(results).toEqual([])
  })
})

function mock(
  record?: Partial<AmountConfigurationRecord>,
): Omit<AmountConfigurationRecord, 'id'> {
  return {
    indexerId: 'indexer',
    projectId: ProjectId('project'),
    chain: 'chain',
    address: EthereumAddress.ZERO,
    origin: 'native',
    type: 'circulatingSupply',
    includeInTotal: true,
    sinceTimestampInclusive: UnixTime.ZERO,
    ...record,
  }
}
