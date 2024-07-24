import { expect } from 'earl'

import { describeDatabase } from '../test/database'
import { IndexerConfigurationRecord } from './entity'
import { IndexerConfigurationRepository } from './repository'

describeDatabase(IndexerConfigurationRepository.name, (db) => {
  const repository = db.indexerConfiguration

  const CONFIGURATIONS = [
    mock({ id: 'a'.repeat(12), indexerId: 'indexer-1' }),
    mock({ id: 'b'.repeat(12), indexerId: 'indexer-1' }),
    mock({ id: 'c'.repeat(12), indexerId: 'indexer-2' }),
    mock({ id: 'd'.repeat(12), indexerId: 'indexer-3' }),
  ]

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(
    IndexerConfigurationRepository.prototype.addOrUpdateMany.name,
    () => {
      it('adds new records', async () => {
        const newRecords = [CONFIGURATIONS[0]!, CONFIGURATIONS[1]!]

        await repository.addOrUpdateMany(newRecords)

        const result = await repository.getAll()

        expect(result).toEqualUnsorted(newRecords)
      })

      describe('updates existing record', () => {
        const columns = [
          { column: 'indexerId', value: 'new-indexer' },
          { column: 'currentHeight', value: 123 },
          { column: 'minHeight', value: 0 },
          { column: 'maxHeight', value: 666 },
          { column: 'properties', value: 'new-properties' },
        ]
        for (const c of columns) {
          it(`updates ${c.column}`, async () => {
            await repository.addOrUpdateMany([mock({ id: 'a'.repeat(12) })])
            const recordsPostUpsert: IndexerConfigurationRecord[] = [
              {
                ...CONFIGURATIONS[0]!,
                [c.column]: c.value,
              },
            ]
            await repository.addOrUpdateMany(recordsPostUpsert)
            const result = await repository.getAll()
            expect(result).toEqualUnsorted(recordsPostUpsert)
          })
        }
      })
    },
  )

  describe(
    IndexerConfigurationRepository.prototype.getSavedConfigurationsByIds.name,
    () => {
      it('returns configurations by ids', async () => {
        await repository.addOrUpdateMany(CONFIGURATIONS)

        const result = await repository.getSavedConfigurationsByIds([
          CONFIGURATIONS[0]!.id,
          CONFIGURATIONS[2]!.id,
        ])
        expect(result).toEqualUnsorted([CONFIGURATIONS[0]!, CONFIGURATIONS[2]!])
      })
    },
  )

  it(
    IndexerConfigurationRepository.prototype.getSavedConfigurations.name,
    async () => {
      const records = CONFIGURATIONS

      await repository.addOrUpdateMany(records)

      const result = await repository.getSavedConfigurations('indexer-1')

      expect(result).toEqualUnsorted(records.slice(0, 2))
    },
  )

  it(
    IndexerConfigurationRepository.prototype.updateSavedConfigurations.name,
    async () => {
      const records = [
        config('a', 1, null, 10), // update: current < toUpdate
        config('b', 1, null, null), // update: current == null
        config('c', 1, null, 1_000), // do not update: current > toUpdate
        config('d', 1_000, null, null), // do  not update: min > toUpdate
        config('e', 1, 10, null), // do not update: max < toUpdate
        { ...config('f', 1, null, null), indexerId: 'other' }, // do not update: other indexer
      ]

      await repository.addOrUpdateMany(records)

      await repository.updateSavedConfigurations('indexer', 100)

      const result = await repository.getAll()

      expect(result).toEqualUnsorted([
        { ...records[0]!, currentHeight: 100 },
        { ...records[1]!, currentHeight: 100 },
        records[2]!,
        records[3]!,
        records[4]!,
        records[5]!,
      ])
    },
  )

  describe(
    IndexerConfigurationRepository.prototype.deleteConfigurationsExcluding.name,
    () => {
      it('excluding 1 2 3', async () => {
        const records = CONFIGURATIONS

        await repository.addOrUpdateMany(records)
        await repository.deleteConfigurationsExcluding('indexer-1', [
          CONFIGURATIONS[1]!.id,
          CONFIGURATIONS[2]!.id,
          CONFIGURATIONS[3]!.id,
        ])

        const result = await repository.getAll()

        expect(result).toEqualUnsorted([
          CONFIGURATIONS[1]!,
          CONFIGURATIONS[2]!,
          CONFIGURATIONS[3]!,
        ])
      })

      it('excluding nothing', async () => {
        const records = CONFIGURATIONS

        await repository.addOrUpdateMany(records)
        await repository.deleteConfigurationsExcluding('indexer-1', [])

        const result = await repository.getAll()

        expect(result).toEqualUnsorted(
          CONFIGURATIONS.filter((x) => x.indexerId !== 'indexer-1'),
        )
      })
    },
  )
})

function mock(
  record: Partial<IndexerConfigurationRecord>,
): IndexerConfigurationRecord {
  return {
    id: 'id',
    indexerId: 'indexer',
    currentHeight: null,
    minHeight: 0,
    maxHeight: null,
    properties: 'properties',
    ...record,
  }
}

function config(
  id: string,
  minHeight: number,
  maxHeight: number | null,
  currentHeight: number | null,
) {
  return mock({
    id: id.repeat(12),
    minHeight,
    maxHeight,
    currentHeight,
  })
}
