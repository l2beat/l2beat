import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { createCallerFactory } from '../../../../../../trpc/init'
import { createTransfersRouter } from './transfers'

describe(createTransfersRouter.name, () => {
  it('uses the promoted aggregate window for transfer stats', async () => {
    const getLatestPromotedTimestamp = mockFn().resolvesTo(UnixTime(500_000))
    const getStats = mockFn().resolvesTo([])
    const getDetailedStats = mockFn().resolvesTo([])
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
    expect(getStats).toHaveBeenOnlyCalledWith(timeRange)
    expect(getDetailedStats).toHaveBeenOnlyCalledWith(timeRange)
  })

  it('keeps all retained data explicit for detail queries', async () => {
    const getByType = mockFn().resolvesTo([])
    const caller = createCaller(
      mockObject<Database>({
        interopTransfer: mockObject<Database['interopTransfer']>({
          getByType,
        }),
      }),
    )

    await caller.details({ type: 'deposit', range: 'all' })

    expect(getByType).toHaveBeenOnlyCalledWith('deposit', {
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
