import { Logger } from '@l2beat/backend-tools'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import {
  IndexerConfigurationRecord,
  IndexerConfigurationRepository,
} from './IndexerConfigurationRepository'
import { IndexerStateRepository } from './IndexerStateRepository'

describeDatabase(IndexerConfigurationRepository.name, (database) => {
  const indexerStateRepository = new IndexerStateRepository(
    database,
    Logger.SILENT,
  )
  const repository = new IndexerConfigurationRepository(database, Logger.SILENT)

  const INDEXERS = ['indexer-1', 'indexer-2', 'indexer-3']
  const CONFIGURATIONS = [
    mock({ id: 'a'.repeat(12), indexerId: INDEXERS[0] }),
    mock({ id: 'b'.repeat(12), indexerId: INDEXERS[0] }),
    mock({ id: 'c'.repeat(12), indexerId: INDEXERS[1] }),
    mock({ id: 'd'.repeat(12), indexerId: INDEXERS[2] }),
  ]

  beforeEach(async () => {
    await Promise.all(
      INDEXERS.map((i) => indexerStateRepository.add(mockIndexer(i))),
    )
  })

  afterEach(async () => {
    await indexerStateRepository.deleteAll()
  })

  it(
    IndexerConfigurationRepository.prototype.addOrUpdateManyConfigurations.name,
    async () => {
      const records = [CONFIGURATIONS[0], CONFIGURATIONS[1]]

      await repository.addOrUpdateManyConfigurations(records)

      const result = await repository.getAll()

      expect(result).toEqualUnsorted(records)
    },
  )

  it(
    IndexerConfigurationRepository.prototype.getSavedConfigurations.name,
    async () => {
      const records = CONFIGURATIONS

      await repository.addOrUpdateManyConfigurations(records)

      const result = await repository.getSavedConfigurations('indexer-1')

      expect(result).toEqualUnsorted(records.slice(0, 2))
    },
  )

  it(
    IndexerConfigurationRepository.prototype.updateSavedConfigurations.name,
    async () => {
      const records = CONFIGURATIONS

      await repository.addOrUpdateManyConfigurations(records)
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

      await repository.addOrUpdateManyConfigurations(records)
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

function mockIndexer(indexerId: string) {
  return {
    indexerId,
    safeHeight: 0,
  }
}
