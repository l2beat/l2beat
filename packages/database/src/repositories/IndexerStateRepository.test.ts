import { UnixTime } from '@l2beat/shared-pure'
import { afterEach, describe, expect, it } from 'vitest'

import { describeDatabase } from '../test/database'
import { IndexerStateRepository } from './IndexerStateRepository'

describeDatabase(IndexerStateRepository.name, (db) => {
  const repository = db.indexerState

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(IndexerStateRepository.prototype.findByIndexerId.name, () => {
    it('returns undefined if no record exists', async () => {
      const indexerState = await repository.findByIndexerId('indexer')
      expect(indexerState).toStrictEqual(undefined)
    })

    it('returns the indexer state if a record exists', async () => {
      const newRecord = {
        indexerId: 'indexer1',
        safeHeight: 12345,
        minTimestamp: UnixTime.now(),
        configHash: '0x123456',
      }
      await repository.upsert(newRecord)
      const indexerState = await repository.findByIndexerId('indexer1')
      expect(indexerState).toStrictEqual(newRecord)
    })
  })

  describe(IndexerStateRepository.prototype.getByIndexerIds.name, () => {
    it('returns indexer matching like statement', async () => {
      const record = {
        indexerId: 'a',
        safeHeight: 12345,
        minTimestamp: UnixTime.now(),
        configHash: '0x123456',
      }
      await repository.upsert(record)
      const record2 = {
        indexerId: 'b',
        safeHeight: 12345,
        minTimestamp: UnixTime.now(),
        configHash: '0x123456',
      }
      await repository.upsert(record2)
      const record3 = {
        indexerId: 'c',
        safeHeight: 12345,
        minTimestamp: UnixTime.now(),
        configHash: '0x123456',
      }
      await repository.upsert(record3)

      const indexerState = await repository.getByIndexerIds(['a', 'b'])
      expect(indexerState).toStrictEqual([record, record2])
    })
  })

  describe(IndexerStateRepository.prototype.upsert.name, () => {
    it('adds a new record', async () => {
      const empty = await repository.getAll()
      expect(empty).toStrictEqual([])

      const newRecord = {
        indexerId: 'indexer1',
        safeHeight: 1,
        minTimestamp: UnixTime.now(),
        configHash: '0x123456',
      }

      await repository.upsert(newRecord)

      const result = await repository.getAll()
      expect(result).toStrictEqual([newRecord])
    })

    it('minTimestamp is undefined', async () => {
      const record = {
        indexerId: 'indexer1',
        safeHeight: 1,
        configHash: '0x123456',
      }
      await repository.upsert(record)

      const result = await repository.getAll()

      expect(result).toStrictEqual([{ ...record, minTimestamp: undefined }])
    })

    it('configHash is undefined', async () => {
      const record = {
        indexerId: 'indexer1',
        safeHeight: 1,
        minTimestamp: 0,
      }
      await repository.upsert(record)

      const result = await repository.getAll()

      expect(result).toStrictEqual([{ ...record, configHash: undefined }])
    })
  })

  describe(IndexerStateRepository.prototype.updateSafeHeight.name, () => {
    it('updates the safe height of given indexer', async () => {
      const BEFORE = 12345
      const AFTER = 54321
      const record = {
        indexerId: 'indexer1',
        safeHeight: BEFORE,
        minTimestamp: UnixTime.now(),
        configHash: '0x123456',
      }
      await repository.upsert(record)

      const updated = await repository.updateSafeHeight('indexer1', AFTER)
      const indexerState = await repository.findByIndexerId('indexer1')

      expect(updated).toStrictEqual(1)
      expect(indexerState).toStrictEqual({ ...record, safeHeight: AFTER })
    })

    it('does not update if indexer not found', async () => {
      const BEFORE = 12345
      const AFTER = 54321
      const record = {
        indexerId: 'indexer1',
        safeHeight: BEFORE,
        minTimestamp: UnixTime.now(),
        configHash: '0x123456',
      }
      await repository.upsert(record)

      const updated = await repository.updateSafeHeight('indexer2', AFTER)
      const indexerState = await repository.findByIndexerId('indexer1')

      expect(updated).toStrictEqual(0)
      expect(indexerState).toStrictEqual({ ...record })
    })
  })
})
