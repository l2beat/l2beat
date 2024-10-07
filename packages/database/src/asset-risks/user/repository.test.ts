import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { AssetRisksUserRepository } from './repository'

describeDatabase(AssetRisksUserRepository.name, (db) => {
  const repository = db.assetRisksUser

  describe(AssetRisksUserRepository.prototype.upsert.name, () => {
    it('adds new rows', async () => {
      await repository.upsert({
        address: '0x0000000000000000000000000000000000000000',
      })
      await repository.upsert({
        address: '0x0000000000000000000000000000000000000001',
      })

      console.log(await repository.getAll())

      expect(
        await repository.findUserByAddress(
          '0x0000000000000000000000000000000000000000',
        ),
      ).toBeTruthy()
      expect(
        await repository.findUserByAddress(
          '0x0000000000000000000000000000000000000001',
        ),
      ).toBeTruthy()
      expect(
        await repository.findUserByAddress(
          '0x0000000000000000000000000000000000000002',
        ),
      ).toBeFalsy()
    })

    it('updates updatedAt on upsert', async () => {
      await repository.upsert({
        address: '0x0000000000000000000000000000000000000000',
      })

      const user = await repository.findUserByAddress(
        '0x0000000000000000000000000000000000000000',
      )
      expect(user).toBeTruthy()

      await repository.upsert({
        address: '0x0000000000000000000000000000000000000000',
      })
      const user2 = await repository.findUserByAddress(
        '0x0000000000000000000000000000000000000000',
      )
      expect(user2?.updatedAt).toBeTruthy()
      expect(user2?.updatedAt.getTime() ?? 0).toBeGreaterThan(
        user?.updatedAt.getTime() ?? 0,
      )
    })
  })

  describe(AssetRisksUserRepository.prototype.findUserById.name, () => {
    it('returns the user with the given id', async () => {
      await repository.upsert({
        address: '0x0000000000000000000000000000000000000000',
      })
      const user = await repository.getAll()
      expect(await repository.findUserById(user[0]!.id)).toBeTruthy()
      expect(await repository.findUserById('b')).toBeFalsy()
    })
  })

  describe(AssetRisksUserRepository.prototype.findUserByAddress.name, () => {
    it('returns the user with the given address', async () => {
      await repository.upsert({
        address: '0x0000000000000000000000000000000000000000',
      })
      expect(
        await repository.findUserByAddress(
          '0x0000000000000000000000000000000000000000',
        ),
      ).toBeTruthy()
      expect(
        await repository.findUserByAddress(
          '0x0000000000000000000000000000000000000001',
        ),
      ).toBeFalsy()
    })
  })

  afterEach(async function () {
    await repository.deleteAll()
  })
})
