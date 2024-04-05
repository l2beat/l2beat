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
    mock({ id: 'a', indexerId: 'indexer-1' }),
    mock({ id: 'b', indexerId: 'indexer-1' }),
    mock({ id: 'c', indexerId: 'indexer-2' }),
    mock({ id: 'd', indexerId: 'indexer-3' }),
  ]

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(
    IndexerConfigurationRepository.prototype.addManySavedConfigurations.name,
    async () => {
      const records = [CONFIGURATIONS[0], CONFIGURATIONS[1]]

      await repository.addManySavedConfigurations(records)

      const result = await repository.getAll()

      expect(result).toEqualUnsorted(records)
    },
  )

  it(
    IndexerConfigurationRepository.prototype.getSavedConfigurations.name,
    async () => {
      const records = CONFIGURATIONS

      await repository.addManySavedConfigurations(records)

      const result = await repository.getSavedConfigurations('indexer-1')

      expect(result).toEqualUnsorted(records.slice(0, 2))
    },
  )

  it(
    IndexerConfigurationRepository.prototype.updateSavedConfigurations.name,
    async () => {
      const records = CONFIGURATIONS

      await repository.addManySavedConfigurations(records)
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
    IndexerConfigurationRepository.prototype.deleteSavedConfigurations.name,
    async () => {
      const records = CONFIGURATIONS

      await repository.addManySavedConfigurations(records)
      await repository.deleteSavedConfigurations('indexer-1', [
        records[0].id,
        records[2].id, // test .whereIn clause
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
