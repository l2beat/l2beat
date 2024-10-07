import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { AssetRisksUserRepository } from './repository'
import { assert } from '@l2beat/shared-pure'

describeDatabase(AssetRisksUserRepository.name, (db) => {
  const repository = db.assetRisksUser

  describe(AssetRisksUserRepository.prototype.upsert.name, () => {
    it('adds new rows', async () => {
      await repository.upsert({ address: 'a' })
      await repository.upsert({ address: 'b' })

      expect(await repository.findUserByAddress('a')).toBeTruthy()
      expect(await repository.findUserByAddress('b')).toBeTruthy()
      expect(await repository.findUserByAddress('c')).toBeFalsy()
    })

    it('updates updatedAt on upsert', async () => {
      await repository.upsert({ address: 'a' })
      await repository.upsert({ address: 'b' })

      const user = await repository.findUserByAddress('a')
      expect(user).toBeTruthy()

      await repository.upsert({ address: 'a' })
      const user2 = await repository.findUserByAddress('a')
      expect(user2?.updatedAt).toBeTruthy()
      expect(user2?.updatedAt.getTime() ?? 0).toBeGreaterThan(
        user?.updatedAt.getTime() ?? 0,
      )
    })
  })

  describe(AssetRisksUserRepository.prototype.findUserById.name, () => {
    it('returns the user with the given id', async () => {
      await repository.upsert({ address: 'a' })
      const user = await repository.getAll()
      expect(await repository.findUserById(user[0]!.id)).toBeTruthy()
      expect(await repository.findUserById('b')).toBeFalsy()
    })
  })

  describe(AssetRisksUserRepository.prototype.findUserByAddress.name, () => {
    it('returns the user with the given address', async () => {
      await repository.upsert({ address: 'a' })
      expect(await repository.findUserByAddress('a')).toBeTruthy()
      expect(await repository.findUserByAddress('b')).toBeFalsy()
    })
  })

  afterEach(async function () {
    await repository.deleteAll()
  })
})
