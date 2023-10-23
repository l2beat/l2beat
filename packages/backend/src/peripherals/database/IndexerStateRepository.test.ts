import { Logger } from '@l2beat/backend-tools'
import { Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../test/database'
import { IndexerStateRepository } from './IndexerStateRepository'

describe(IndexerStateRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new IndexerStateRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(IndexerStateRepository.prototype.findSafeHeight.name, () => {
    it('returns undefined if no record exists', async () => {
      const safeHeight = await repository.findSafeHeight('indexer')
      expect(safeHeight).toEqual(undefined)
    })

    it('returns the safe height if a record exists', async () => {
      const newRecord = {
        indexerId: 'indexer1',
        configHash: Hash256.random(),
        safeHeight: 12345,
      }
      await repository.addOrUpdate(newRecord)
      const safeHeight = await repository.findSafeHeight('indexer1')
      expect(safeHeight).toEqual(newRecord.safeHeight)
    })
  })

  describe(IndexerStateRepository.prototype.addOrUpdate.name, () => {
    it('adds a new record', async () => {
      const newRecord = {
        indexerId: 'indexer1',
        configHash: Hash256.random(),
        safeHeight: 1,
      }

      await repository.addOrUpdate(newRecord)

      const result = await repository.getAll()

      expect(result).toEqual([newRecord])
    })

    it('updates an existing record', async () => {
      const record = {
        indexerId: 'indexer1',
        configHash: Hash256.random(),
        safeHeight: 1,
      }
      await repository.addOrUpdate(record)

      const updatedRecord = { ...record, safeHeight: 2 }
      await repository.addOrUpdate(updatedRecord)

      const result = await repository.getAll()

      expect(result).toEqual([updatedRecord])
    })
  })
})
