import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type LiveCheckRecord,
  LiveCheckRepository,
} from './LiveCheckRepository'

describeDatabase(LiveCheckRepository.name, (db) => {
  const repository = db.liveCheck
  const START = UnixTime.toStartOf(UnixTime.now(), 'hour')

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(LiveCheckRepository.prototype.upsert.name, () => {
    it('replaces the result of hours compared again', async () => {
      await repository.upsert(check('ethereum', 0, 'uncovered'))
      await repository.upsert(check('ethereum', 1, 'match'))
      const again = {
        ...check('ethereum', 0, 'mismatch'),
        missing: 2,
        checkedAt: START + 60,
      }

      await repository.upsert(again)

      expect(await repository.getAll()).toEqualUnsorted([
        again,
        check('ethereum', 1, 'match'),
      ])
    })

    it('keeps a mismatch when the same hours match on a retry', async () => {
      const mismatch = { ...check('ethereum', 0, 'mismatch'), extra: 1 }
      await repository.upsert(mismatch)

      await repository.upsert(check('ethereum', 0, 'match'))
      await repository.upsert(check('ethereum', 0, 'uncovered'))

      expect(await repository.getAll()).toEqual([mismatch])
    })
  })

  describe(LiveCheckRepository.prototype.getChainsWith.name, () => {
    it('returns the chains with a result of the status for the feature, each once', async () => {
      await repository.upsert(check('ethereum', 0, 'mismatch'))
      await repository.upsert(check('ethereum', 1, 'mismatch'))
      await repository.upsert(check('base', 0, 'match'))
      await repository.upsert(check('arbitrum', 0, 'uncovered'))
      await repository.upsert({
        ...check('optimism', 0, 'mismatch'),
        feature: 'activity',
      })

      expect(
        await repository.getChainsWith('privacy.flow', 'mismatch'),
      ).toEqual(['ethereum'])
      expect(await repository.getChainsWith('privacy.flow', 'match')).toEqual([
        'base',
      ])
    })
  })

  describe(LiveCheckRepository.prototype.getNewestByChain.name, () => {
    it('returns how the newest hours of each chain compared, and up to when hours with rows matched', async () => {
      await repository.upsert({ ...check('ethereum', 0, 'match'), compared: 3 })
      await repository.upsert(check('ethereum', 1, 'match'))
      await repository.upsert(check('ethereum', 2, 'uncovered'))
      // matched, but with nothing to compare
      await repository.upsert(check('base', 1, 'uncovered'))
      await repository.upsert(check('base', 2, 'match'))
      await repository.upsert({
        ...check('base', 3, 'mismatch'),
        feature: 'activity',
      })

      expect(await repository.getNewestByChain('privacy.flow')).toEqualUnsorted(
        [
          {
            chain: 'ethereum',
            status: 'uncovered',
            matchedRowsUntil: START + UnixTime.HOUR,
          },
          { chain: 'base', status: 'match', matchedRowsUntil: undefined },
        ],
      )
    })
  })

  function check(
    chain: string,
    hour: number,
    status: LiveCheckRecord['status'],
  ): LiveCheckRecord {
    return {
      feature: 'privacy.flow',
      chain,
      from: START + hour * UnixTime.HOUR,
      to: START + (hour + 1) * UnixTime.HOUR,
      status,
      compared: 0,
      missing: 0,
      extra: 0,
      changed: 0,
      checkedAt: START,
    }
  }
})
