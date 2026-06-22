import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { createCallerFactory } from '../../../../../../trpc/init'
import { createPromotionRouter } from './promotion'

describe(createPromotionRouter.name, () => {
  function createCaller(
    interopAggregateStatus: Database['interopAggregateStatus'],
  ) {
    const db = mockObject<Database>({ interopAggregateStatus })
    const callerFactory = createCallerFactory(createPromotionRouter())
    return callerFactory({
      headers: new Headers(),
      db,
      session: { email: 'ops@l2beat.com' },
    })
  }

  describe('listRecent', () => {
    it('maps recent snapshots to DTOs, normalizing reasons', async () => {
      const getRecent = mockFn().resolvesTo([
        {
          timestamp: UnixTime(200),
          status: 'blocked',
          promotedBy: 'auto',
          reasons: [
            {
              rule: 'maxLaneVolume',
              scope: 'a|b|c|d',
              value: 9,
              threshold: 1,
              message: 'too big',
            },
          ],
          checkedAt: UnixTime(210),
          updatedAt: UnixTime(210),
        },
        {
          timestamp: UnixTime(100),
          status: 'promoted',
          promotedBy: 'auto',
          reasons: undefined,
          checkedAt: UnixTime(110),
          updatedAt: UnixTime(110),
        },
      ])
      const caller = createCaller(
        mockObject<Database['interopAggregateStatus']>({ getRecent }),
      )

      const result = await caller.listRecent()

      expect(getRecent).toHaveBeenCalledTimes(1)
      expect(result).toEqual([
        {
          timestamp: 200,
          status: 'blocked',
          promotedBy: 'auto',
          reasons: [
            {
              rule: 'maxLaneVolume',
              scope: 'a|b|c|d',
              value: 9,
              threshold: 1,
              message: 'too big',
            },
          ],
          checkedAt: 210,
          updatedAt: 210,
        },
        {
          timestamp: 100,
          status: 'promoted',
          promotedBy: 'auto',
          reasons: [],
          checkedAt: 110,
          updatedAt: 110,
        },
      ])
    })
  })

  describe('promote', () => {
    it('upserts a promoted verdict with the operator email, preserving reasons', async () => {
      const reasons = [
        {
          rule: 'maxLaneVolume',
          scope: 'a|b|c|d',
          value: 9,
          threshold: 1,
          message: 'too big',
        },
      ]
      const getByTimestamp = mockFn().resolvesTo({
        timestamp: UnixTime(100),
        status: 'blocked',
        promotedBy: 'auto',
        reasons,
        checkedAt: UnixTime(110),
        updatedAt: UnixTime(110),
      })
      const upsert = mockFn().resolvesTo(undefined)
      const caller = createCaller(
        mockObject<Database['interopAggregateStatus']>({
          getByTimestamp,
          upsert,
        }),
      )

      const result = await caller.promote({ timestamp: 100 })

      expect(upsert).toHaveBeenCalledWith({
        timestamp: UnixTime(100),
        status: 'promoted',
        promotedBy: 'ops@l2beat.com',
        reasons,
      })
      expect(result).toEqual({ timestamp: 100 })
    })

    it('promotes even when no prior status row exists (reasons undefined)', async () => {
      const getByTimestamp = mockFn().resolvesTo(undefined)
      const upsert = mockFn().resolvesTo(undefined)
      const caller = createCaller(
        mockObject<Database['interopAggregateStatus']>({
          getByTimestamp,
          upsert,
        }),
      )

      await caller.promote({ timestamp: 100 })

      expect(upsert).toHaveBeenCalledWith({
        timestamp: UnixTime(100),
        status: 'promoted',
        promotedBy: 'ops@l2beat.com',
        reasons: undefined,
      })
    })
  })
})
