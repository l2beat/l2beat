import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import { AmountRecord, AmountRepository } from './AmountRepository'

describeDatabase(AmountRepository.name, (database) => {
  const repository = new AmountRepository(database, Logger.SILENT)

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe('amounts', () => {
    describe(AmountRepository.prototype.addMany.name, () => {
      it('adds new rows', async () => {
        const newRows = [
          {
            configurationId: 1,
            timestamp: UnixTime.ZERO,
            amount: 111n,
          },
          {
            configurationId: 2,
            timestamp: UnixTime.ZERO,
            amount: 111n,
          },
        ]
        await repository.addMany(newRows)

        const results = await repository.getAll()
        expect(results).toEqualUnsorted(newRows)
      })

      it('empty array', async () => {
        await expect(repository.addMany([])).not.toBeRejected()
      })

      it('performs batch insert when more than 10k records', async () => {
        const records: AmountRecord[] = []
        for (let i = 5; i < 15_000; i++) {
          records.push({
            configurationId: 1,
            timestamp: new UnixTime(i),
            amount: 111n,
          })
        }
        await expect(repository.addMany(records)).not.toBeRejected()
      })
    })

    it(AmountRepository.prototype.deleteAll.name, async () => {
      await repository.addMany([
        {
          configurationId: 1,
          timestamp: UnixTime.ZERO,
          amount: 111n,
        },
      ])

      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toEqual([])
    })
  })
})
