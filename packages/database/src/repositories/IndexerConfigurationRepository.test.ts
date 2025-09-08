import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type IndexerConfigurationRecord,
  IndexerConfigurationRepository,
} from './IndexerConfigurationRepository'

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

  describe(IndexerConfigurationRepository.prototype.upsertMany.name, () => {
    it('adds new records', async () => {
      const newRecords = [CONFIGURATIONS[0]!, CONFIGURATIONS[1]!]

      await repository.upsertMany(newRecords)

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
          await repository.upsertMany([mock({ id: 'a'.repeat(12) })])
          const recordsPostUpsert: IndexerConfigurationRecord[] = [
            {
              ...CONFIGURATIONS[0]!,
              [c.column]: c.value,
            },
          ]
          await repository.upsertMany(recordsPostUpsert)
          const result = await repository.getAll()
          expect(result).toEqualUnsorted(recordsPostUpsert)
        })
      }
    })
  })

  describe(IndexerConfigurationRepository.prototype.insertMany.name, () => {
    it('adds new records', async () => {
      const newRecords = [CONFIGURATIONS[0]!, CONFIGURATIONS[1]!]

      await repository.upsertMany(newRecords)

      const result = await repository.getAll()

      expect(result).toEqualUnsorted(newRecords)
    })
  })

  describe(
    IndexerConfigurationRepository.prototype.getByConfigurationIds.name,
    () => {
      it('returns configurations by ids', async () => {
        await repository.upsertMany(CONFIGURATIONS)

        const result = await repository.getByConfigurationIds([
          CONFIGURATIONS[0]!.id,
          CONFIGURATIONS[2]!.id,
        ])
        expect(result).toEqualUnsorted([CONFIGURATIONS[0]!, CONFIGURATIONS[2]!])
      })
    },
  )

  it(IndexerConfigurationRepository.prototype.getByIndexerId.name, async () => {
    const records = CONFIGURATIONS

    await repository.upsertMany(records)

    const result = await repository.getByIndexerId('indexer-1')

    expect(result).toEqualUnsorted(records.slice(0, 2))
  })

  it(
    IndexerConfigurationRepository.prototype.getByIndexerIds.name,
    async () => {
      const records = CONFIGURATIONS

      await repository.upsertMany(records)

      const result = await repository.getByIndexerIds([
        'indexer-1',
        'indexer-2',
      ])

      expect(result).toEqualUnsorted(records.slice(0, 3))
    },
  )

  it(
    IndexerConfigurationRepository.prototype.getConfigurationsWithoutIndexerId
      .name,
    async () => {
      const records = CONFIGURATIONS

      await repository.upsertMany(records)

      const result =
        await repository.getConfigurationsWithoutIndexerId('indexer-1')

      expect(result).toEqualUnsorted(
        records.slice(0, 2).map((c) => ({
          currentHeight: c.currentHeight,
          maxHeight: c.maxHeight,
          minHeight: c.minHeight,
          id: c.id,
          properties: c.properties,
        })),
      )
    },
  )

  it(
    IndexerConfigurationRepository.prototype.getIdsByIndexer.name,
    async () => {
      const records = CONFIGURATIONS

      await repository.upsertMany(records)

      const result = await repository.getIdsByIndexer('indexer-1')

      expect(result).toEqualUnsorted(records.slice(0, 2).map((r) => r.id))
    },
  )

  it(
    IndexerConfigurationRepository.prototype.updateCurrentHeights.name,
    async () => {
      const records = [
        config('a', 1, null, 10), // update: current < toUpdate
        config('b', 1, null, null), // update: current == null
        config('c', 1, null, 1_000), // do not update: current > toUpdate
        config('d', 1_000, null, null), // do  not update: min > toUpdate
        config('e', 1, 10, null), // do not update: max < toUpdate
        { ...config('f', 1, null, null), indexerId: 'other' }, // do not update: other indexer
      ]

      await repository.upsertMany(records)

      await repository.updateCurrentHeights('indexer', 100)

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
    IndexerConfigurationRepository.prototype.deleteConfigurations.name,
    () => {
      it('delete correctly by id and indexer', async () => {
        const records = [
          config('a', 1, null, 10),
          config('b', 1, null, 10),
          { ...config('c', 1, null, 10), indexerId: 'other' },
          config('d', 1, null, 10),
        ]
        await repository.upsertMany(records)

        await repository.deleteConfigurations('indexer', [
          'a'.repeat(12),
          'b'.repeat(12),
          'c'.repeat(12),
        ])

        const result = await repository.getAll()

        expect(result).toEqualUnsorted([
          { ...config('c', 1, null, 10), indexerId: 'other' },
          config('d', 1, null, 10),
        ])
      })

      it('works for bigger query', async () => {
        await repository.deleteConfigurations(
          'indexer',
          [...Array(100_000)].map((_) => 'a'.repeat(12)),
        )

        const result = await repository.getAll()

        expect(result).toEqualUnsorted([])
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
