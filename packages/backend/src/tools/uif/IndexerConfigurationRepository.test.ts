import { Logger } from '@l2beat/backend-tools'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import {
  IndexerConfigurationRecord,
  IndexerConfigurationRepository,
} from './IndexerConfigurationRepository'

describeDatabase(IndexerConfigurationRepository.name, (database) => {
  const repository = new IndexerConfigurationRepository(database, Logger.SILENT)

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
        const newRecords = [CONFIGURATIONS[0], CONFIGURATIONS[1]]

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
                ...CONFIGURATIONS[0],
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
      const records = CONFIGURATIONS

      await repository.addOrUpdateMany(records)
      await repository.updateSavedConfigurations(
        'indexer-1',
        records.slice(0, 3).map((r) => r.id), // test .whereIn clause
        123,
      )

      const result = await repository.getAll()

      expect(result).toEqualUnsorted([
        ...records.slice(0, 2).map((r) => ({ ...r, currentHeight: 123 })),
        CONFIGURATIONS[2],
        CONFIGURATIONS[3],
      ])
    },
  )

  it(
    IndexerConfigurationRepository.prototype.deleteConfigurationsExcluding.name,
    async () => {
      const records = CONFIGURATIONS

      await repository.addOrUpdateMany(records)
      await repository.deleteConfigurationsExcluding('indexer-1', [
        CONFIGURATIONS[1].id,
        CONFIGURATIONS[2].id,
        CONFIGURATIONS[3].id,
      ])

      const result = await repository.getAll()

      expect(result).toEqualUnsorted([
        CONFIGURATIONS[1],
        CONFIGURATIONS[2],
        CONFIGURATIONS[3],
      ])
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
