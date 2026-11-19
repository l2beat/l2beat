import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { ChainHeadRepository } from './ChainHeadRepository'

describeDatabase(ChainHeadRepository.name, (db) => {
  const repository = db.chainHead
  const NOW = UnixTime.toStartOf(UnixTime.now(), 'hour')

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(ChainHeadRepository.prototype.upsert.name, () => {
    it('keeps one row per chain, the last one written', async () => {
      await repository.upsert({ chain: 'base', number: 1, confirmedAt: NOW })
      await repository.upsert({
        chain: 'ethereum',
        number: 7,
        confirmedAt: NOW,
      })

      await repository.upsert({
        chain: 'base',
        number: 2,
        confirmedAt: NOW + 10,
      })

      expect(await repository.getAll()).toEqualUnsorted([
        { chain: 'base', number: 2, confirmedAt: NOW + 10 },
        { chain: 'ethereum', number: 7, confirmedAt: NOW },
      ])
    })
  })
})
