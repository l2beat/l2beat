import { expect } from 'earl'
import { describeTokenDatabase } from '../test/tokenDatabase'
import { TokenDbSettingRepository } from './TokenDbSettingRepository'

describeTokenDatabase(TokenDbSettingRepository.name, (db) => {
  const repository = db.tokenDbSettings

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(TokenDbSettingRepository.prototype.get.name, () => {
    it('returns undefined when setting is missing', async () => {
      expect(await repository.get('interop-transfers:lastSerialId')).toEqual(
        undefined,
      )
    })
  })

  describe(TokenDbSettingRepository.prototype.set.name, () => {
    it('inserts and updates a setting', async () => {
      await repository.set({
        key: 'interop-transfers:lastSerialId',
        value: '10',
      })
      await repository.set({
        key: 'interop-transfers:lastSerialId',
        value: '25',
      })

      expect(await repository.get('interop-transfers:lastSerialId')).toEqual({
        key: 'interop-transfers:lastSerialId',
        value: '25',
      })
    })
  })
})
