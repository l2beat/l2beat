import { Logger } from '@l2beat/backend-tools'
import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import { VerifierStatusRepository } from './VerifierStatusRepository'

describeDatabase(VerifierStatusRepository.name, (knex, kysely) => {
  const oldRepo = new VerifierStatusRepository(knex, Logger.SILENT)
  const newRepo = kysely.verifierStatus

  suite(oldRepo)
  suite(newRepo)

  function suite(repository: typeof oldRepo | typeof newRepo) {
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
        await repository.addOrUpdate(newRecord)
        const verifierStatus = await repository.findVerifierStatus(
          newRecord.address,
          newRecord.chainId,
        )
        expect(verifierStatus).toEqual(newRecord)
      })
    })

    describe(VerifierStatusRepository.prototype.addOrUpdate.name, () => {
      const existingRecord = {
        address: EthereumAddress.random().toString(),
        chainId: ChainId.ETHEREUM,
        lastUsed: UnixTime.now().add(-2, 'hours'),
        lastUpdated: UnixTime.now().add(-1, 'hours'),
      }

      beforeEach(async () => {
        await repository.addOrUpdate(existingRecord)
      })

      it('adds a new record', async () => {
        const newRecord = {
          address: EthereumAddress.random().toString(),
          chainId: ChainId.ETHEREUM,
          lastUsed: UnixTime.now(),
          lastUpdated: UnixTime.now(),
        }

        await repository.addOrUpdate(newRecord)

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

        await repository.addOrUpdate(newRecord)

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
  }
})
