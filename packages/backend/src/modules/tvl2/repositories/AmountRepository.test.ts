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
  const INDEXER = 'test_indexer'

  beforeEach(async () => {
    IDS = await configurationRepository.addMany([
      mock({
        projectId: ProjectId.ARBITRUM,
        indexerId: INDEXER,
      }),
      mock(),
    ])
  })

  afterEach(async () => {
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

  it(AmountRepository.prototype.getByProjectAndTimestamp.name, async () => {
    await repository.addMany([
      {
        configurationId: IDS[0],
        timestamp: new UnixTime(0),
        amount: 111n,
      },
      {
        configurationId: IDS[0],
        timestamp: new UnixTime(1),
        amount: 222n,
      },
      {
        configurationId: IDS[1],
        timestamp: new UnixTime(0),
        amount: 333n,
      },
    ])

    const result = await repository.getByProjectAndTimestamp(
      ProjectId.ARBITRUM,
      new UnixTime(0),
    )

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      ...mock({ projectId: ProjectId.ARBITRUM, indexerId: INDEXER }),
      configurationId: IDS[0],
      timestamp: new UnixTime(0),
      amount: 111n,
    })
  })

  it(
    AmountRepository.prototype.deleteAfterExclusiveByIndexerId.name,
    async () => {
      const records = [
        {
          configurationId: IDS[0],
          timestamp: new UnixTime(0),
          amount: 111n,
        },
        {
          configurationId: IDS[0],
          timestamp: new UnixTime(1),
          amount: 222n,
        },
        {
          configurationId: IDS[1],
          timestamp: new UnixTime(0),
          amount: 333n,
        },
      ]
      await repository.addMany(records)

      await repository.deleteAfterExclusiveByIndexerId(INDEXER, new UnixTime(0))

      const result = await repository.getAll()

      expect(result).toEqual([records[0], records[2]])
    },
  )

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
    source: 'chain',
    address: EthereumAddress.ZERO,
    origin: 'native',
    type: 'circulatingSupply',
    includeInTotal: true,
    sinceTimestampInclusive: UnixTime.ZERO,
    ...record,
  }
}
