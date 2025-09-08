import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../test/database'
import { VerifierStatusRepository } from './VerifierStatusRepository'

describeDatabase(VerifierStatusRepository.name, (db) => {
  const repository = db.verifierStatus

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(VerifierStatusRepository.prototype.findVerifierStatus.name, () => {
    it('returns undefined if no record exists', async () => {
      const verifierStatus = await repository.findVerifierStatus(
        'address',
        ChainId.ETHEREUM,
      )
      expect(verifierStatus).toEqual(undefined)
    })

    it('returns the indexer state if a record exists', async () => {
      const newRecord = {
        address: EthereumAddress.random().toString(),
        chainId: ChainId.ETHEREUM,
        lastUsed: UnixTime.now(),
        lastUpdated: UnixTime.now(),
      }
      await repository.upsert(newRecord)
      const verifierStatus = await repository.findVerifierStatus(
        newRecord.address,
        newRecord.chainId,
      )
      expect(verifierStatus).toEqual(newRecord)
    })
  })

  describe(VerifierStatusRepository.prototype.upsert.name, () => {
    const existingRecord = {
      address: EthereumAddress.random().toString(),
      chainId: ChainId.ETHEREUM,
      lastUsed: UnixTime.now() - 2 * UnixTime.HOUR,
      lastUpdated: UnixTime.now() - 1 * UnixTime.HOUR,
    }

    beforeEach(async () => {
      await repository.upsert(existingRecord)
    })

    it('adds a new record', async () => {
      const newRecord = {
        address: EthereumAddress.random().toString(),
        chainId: ChainId.ETHEREUM,
        lastUsed: UnixTime.now(),
        lastUpdated: UnixTime.now(),
      }

      await repository.upsert(newRecord)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted([existingRecord, newRecord])
    })

    it('updates existing record', async () => {
      const newRecord = {
        address: existingRecord.address,
        chainId: existingRecord.chainId,
        lastUsed: UnixTime.now(),
        lastUpdated: UnixTime.now(),
      }

      await repository.upsert(newRecord)

      const result = await repository.getAll()
      expect(result).toEqual([
        {
          ...existingRecord,
          lastUsed: newRecord.lastUsed,
          lastUpdated: newRecord.lastUpdated,
        },
      ])
    })
  })
})
