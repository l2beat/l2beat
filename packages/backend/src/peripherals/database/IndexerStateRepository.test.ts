import { Logger } from '@l2beat/backend-tools'
import { Hash256, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../test/database'
import { IndexerStateRepository } from './IndexerStateRepository'

describe(IndexerStateRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new IndexerStateRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(IndexerStateRepository.prototype.findIndexerState.name, () => {
    it('returns undefined if no record exists', async () => {
      const indexerState = await repository.findIndexerState('indexer')
      expect(indexerState).toEqual(undefined)
    })

    it('returns the indexer state if a record exists', async () => {
      const newRecord = {
        indexerId: 'indexer1',
        configHash: Hash256.random(),
        safeHeight: 12345,
        minTimestamp: UnixTime.now(),
      }
      await repository.add(newRecord)
      const indexerState = await repository.findIndexerState('indexer1')
      expect(indexerState).toEqual(newRecord)
    })
  })

  describe(IndexerStateRepository.prototype.add.name, () => {
    it('adds a new record', async () => {
      const newRecord = {
        indexerId: 'indexer1',
        configHash: Hash256.random(),
        safeHeight: 1,
        minTimestamp: UnixTime.now(),
      }

      await repository.add(newRecord)

      const result = await repository.getAll()

      expect(result).toEqual([newRecord])
    })

    it('minTimestamp is undefined', async () => {
      const record = {
        indexerId: 'indexer1',
        configHash: Hash256.random(),
        safeHeight: 1,
      }
      await repository.add(record)

      const result = await repository.getAll()

      expect(result).toEqual([{ ...record, minTimestamp: undefined }])
    })
  })

  describe(IndexerStateRepository.prototype.setSafeHeight.name, () => {
    it('updates the safe height of given indexer', async () => {
      const BEFORE = 12345
      const AFTER = 54321
      const record = {
        indexerId: 'indexer1',
        configHash: Hash256.random(),
        safeHeight: BEFORE,
        minTimestamp: UnixTime.now(),
      }
      await repository.add(record)

      const updated = await repository.setSafeHeight('indexer1', AFTER)
      const indexerState = await repository.findIndexerState('indexer1')

      expect(updated).toEqual(1)
      expect(indexerState).toEqual({ ...record, safeHeight: AFTER })
    })

    it('does not update if indexer not found', async () => {
      const BEFORE = 12345
      const AFTER = 54321
      const record = {
        indexerId: 'indexer1',
        configHash: Hash256.random(),
        safeHeight: BEFORE,
        minTimestamp: UnixTime.now(),
      }
      await repository.add(record)

      const updated = await repository.setSafeHeight('indexer2', AFTER)
      const indexerState = await repository.findIndexerState('indexer1')

      expect(updated).toEqual(0)
      expect(indexerState).toEqual({ ...record })
    })
  })

  describe(IndexerStateRepository.prototype.setConfigHash.name, () => {
    it('updates the safe height of given indexer', async () => {
      const BEFORE = Hash256.random()
      const AFTER = Hash256.random()
      const record = {
        indexerId: 'indexer1',
        configHash: BEFORE,
        safeHeight: 12345,
        minTimestamp: UnixTime.now(),
      }
      await repository.add(record)

      const updated = await repository.setConfigHash('indexer1', AFTER)
      const indexerState = await repository.findIndexerState('indexer1')

      expect(updated).toEqual(1)
      expect(indexerState).toEqual({ ...record, configHash: AFTER })
    })

    it('does not update if indexer not found', async () => {
      const BEFORE = Hash256.random()
      const AFTER = Hash256.random()

      const record = {
        indexerId: 'indexer1',
        configHash: BEFORE,
        safeHeight: 12345,
        minTimestamp: UnixTime.now(),
      }
      await repository.add(record)

      const updated = await repository.setConfigHash('indexer2', AFTER)
      const indexerState = await repository.findIndexerState('indexer1')

      expect(updated).toEqual(0)
      expect(indexerState).toEqual({ ...record })
    })
  })
})
