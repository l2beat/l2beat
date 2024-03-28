import { Logger } from '@l2beat/backend-tools'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import {
  AmountConfigurationRecord,
  AmountRecord,
  AmountRepository,
} from './AmountRepository'

describeDatabase(AmountRepository.name, (database) => {
  const repository = new AmountRepository(database, Logger.SILENT)

  afterEach(async () => {
    await repository.deleteAllConfigurations()
  })

  describe('amounts', () => {
    let IDS: number[] = []
    const INDEXER = 'test_indexer'

    beforeEach(async () => {
      IDS = await repository.addManyConfigurations([
        mock({
          indexerId: INDEXER,
          projectId: ProjectId.ARBITRUM,
        }),
        mock({
          indexerId: INDEXER,
          projectId: ProjectId('other-project'),
        }),
        mock({
          indexerId: 'other_indexer',
          projectId: ProjectId.ARBITRUM,
        }),
      ])
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

    it(
      AmountRepository.prototype.getByIndexerProjectAndTimestamp.name,
      async () => {
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
          {
            configurationId: IDS[2],
            timestamp: new UnixTime(0),
            amount: 444n,
          },
        ])

        const result = await repository.getByIndexerProjectAndTimestamp(
          INDEXER,
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
      },
    )

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

        await repository.deleteAfterExclusiveByIndexerId(
          INDEXER,
          new UnixTime(0),
        )

        const result = await repository.getAll()

        expect(result).toEqual([records[0], records[2]])
      },
    )

    it(
      AmountRepository.prototype.deleteInRangeByConfigurationId.name,
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
            timestamp: new UnixTime(1),
            amount: 0n,
          },
          {
            configurationId: IDS[0],
            timestamp: new UnixTime(2),
            amount: 333n,
          },
          {
            configurationId: IDS[0],
            timestamp: new UnixTime(3),
            amount: 444n,
          },
        ]
        await repository.addMany(records)

        await repository.deleteInRangeByConfigurationId(
          IDS[0],
          new UnixTime(1),
          new UnixTime(2),
        )

        const result = await repository.getAll()

        expect(result).toEqualUnsorted([records[0], records[2], records[4]])
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

  describe('configurations', () => {
    describe(AmountRepository.prototype.addManyConfigurations.name, () => {
      it('adds new rows', async () => {
        const newRows = [
          {
            ...mock({ indexerId: 'a' }),
          },
          {
            ...mock({ indexerId: 'b' }),
          },
        ]
        const ids = await repository.addManyConfigurations(newRows)

        const results = await repository.getAllConfigurations()

        expect(results).toEqualUnsorted(
          newRows.map((r, i) => ({ id: ids[i], ...r })),
        )
      })

      it('empty array', async () => {
        await expect(repository.addManyConfigurations([])).not.toBeRejected()
      })

      it('performs batch insert when more than 10k records', async () => {
        const records: Omit<AmountConfigurationRecord, 'id'>[] = []
        for (let i = 5; i < 15_000; i++) {
          records.push({
            ...mock({ indexerId: i.toString() }),
          })
        }
        await expect(
          repository.addManyConfigurations(records),
        ).not.toBeRejected()
      })
    })

    it(
      AmountRepository.prototype.getConfigurationByIndexerId.name,
      async () => {
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
        const ids = await repository.addManyConfigurations(newRows)

        const results = await repository.getConfigurationByIndexerId('a')

        expect(results).toEqualUnsorted(
          newRows.map((r, i) => ({ id: ids[i], ...r })).slice(0, 2),
        )
      },
    )

    it(AmountRepository.prototype.setUntilTimestampInclusive.name, async () => {
      const oldRow = {
        ...mock({ untilTimestampInclusive: undefined }),
      }
      const ids = await repository.addManyConfigurations([oldRow])

      await repository.setUntilTimestampInclusive(ids[0], new UnixTime(1))

      const result = await repository.getAllConfigurations()

      expect(result).toEqual([
        { ...oldRow, id: ids[0], untilTimestampInclusive: new UnixTime(1) },
      ])
    })

    it(AmountRepository.prototype.deleteAll.name, async () => {
      await repository.addManyConfigurations([mock()])

      await repository.deleteAllConfigurations()

      const results = await repository.getAllConfigurations()

      expect(results).toEqual([])
    })
  })
})

function mock(
  record?: Partial<AmountConfigurationRecord>,
): Omit<AmountConfigurationRecord, 'id'> {
  return {
    projectId: ProjectId('project'),
    indexerId: 'indexer',
    chain: 'chain',
    address: EthereumAddress.ZERO,
    origin: 'native',
    type: 'circulatingSupply',
    includeInTotal: true,
    sinceTimestampInclusive: UnixTime.ZERO,
    ...record,
  }
}
