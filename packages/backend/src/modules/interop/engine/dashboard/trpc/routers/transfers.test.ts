import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createCallerFactory } from '../../../../../../trpc/init'
import { createTransfersRouter } from './transfers'

describe(createTransfersRouter.name, () => {
  it('uses the promoted aggregate window for transfer stats', async () => {
    const getLatestPromotedTimestamp = vi
      .fn()
      .mockResolvedValue(UnixTime(500_000))
    const getStats = vi.fn().mockResolvedValue([])
    const getDetailedStats = vi.fn().mockResolvedValue([])
    const caller = createCaller(
      mockObject<Database>({
        interopAggregateStatus: mockObject<Database['interopAggregateStatus']>({
          getLatestPromotedTimestamp,
        }),
        interopTransfer: mockObject<Database['interopTransfer']>({
          getStats,
          getDetailedStats,
        }),
      }),
    )

    await caller.stats({ range: 'lastPromoted' })

    const timeRange = {
      from: UnixTime(500_000 - UnixTime.DAY),
      to: UnixTime(500_000),
    }
    expect(getStats).toHaveBeenCalledExactlyOnceWith(timeRange)
    expect(getDetailedStats).toHaveBeenCalledExactlyOnceWith(timeRange)
  })

  it('keeps all retained data explicit for detail queries', async () => {
    const getByType = vi.fn().mockResolvedValue([])
    const caller = createCaller(
      mockObject<Database>({
        interopTransfer: mockObject<Database['interopTransfer']>({
          getByType,
        }),
      }),
    )

    await caller.details({ type: 'deposit', range: 'all' })

    expect(getByType).toHaveBeenCalledExactlyOnceWith('deposit', {
      plugin: undefined,
      srcChain: undefined,
      dstChain: undefined,
      timeRange: undefined,
    })
  })
})

function createCaller(db: Database) {
  return createCallerFactory(createTransfersRouter())({
    headers: new Headers(),
    db,
    session: { email: 'user@example.com' },
  })
}
