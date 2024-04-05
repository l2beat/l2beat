import { Logger } from '@l2beat/backend-tools'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import { IndexerConfigurationRepository } from './IndexerConfigurationRepository'

describeDatabase(IndexerConfigurationRepository.name, (database) => {
  const repository = new IndexerConfigurationRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(
    IndexerConfigurationRepository.prototype.addManySavedConfigurations.name,
    async () => {
      const records = [
        {
          id: 'a',
          currentHeight: null,
          minHeight: 0,
          maxHeight: null,
          properties: 'a',
        },
        {
          id: 'b',
          currentHeight: null,
          minHeight: 0,
          maxHeight: null,
          properties: 'b',
        },
      ]

      await repository.addManySavedConfigurations(records, 'indexer')

      const result = await repository.getAll()

      expect(result).toEqual(
        records.map((r) => ({ ...r, indexerId: 'indexer' })),
      )
    },
  )
})
