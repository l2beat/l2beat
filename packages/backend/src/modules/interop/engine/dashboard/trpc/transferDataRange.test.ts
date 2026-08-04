import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { resolveInteropTransferTimeRange } from './transferDataRange'

describe(resolveInteropTransferTimeRange.name, () => {
  it('uses a rolling 24-hour window by default', async () => {
    const range = await resolveInteropTransferTimeRange(
      mockObject<Database>({}),
      undefined,
    )

    if (range === undefined) {
      throw new Error('Expected a default time range')
    }

    expect(range.to - range.from).toEqual(UnixTime.DAY)
  })

  it('uses the latest promoted aggregate as the window end', async () => {
    const getLatestPromotedTimestamp = mockFn().resolvesTo(UnixTime(500_000))
    const db = mockObject<Database>({
      interopAggregateStatus: mockObject<Database['interopAggregateStatus']>({
        getLatestPromotedTimestamp,
      }),
    })

    const range = await resolveInteropTransferTimeRange(db, 'lastPromoted')

    expect(getLatestPromotedTimestamp).toHaveBeenOnlyCalledWith()
    expect(range).toEqual({
      from: UnixTime(500_000 - UnixTime.DAY),
      to: UnixTime(500_000),
    })
  })

  it('leaves the query unbounded only when all retained data is selected', async () => {
    const range = await resolveInteropTransferTimeRange(
      mockObject<Database>({}),
      'all',
    )

    expect(range).toEqual(undefined)
  })

  it('does not turn a missing promoted aggregate into an unbounded query', async () => {
    const db = mockObject<Database>({
      interopAggregateStatus: mockObject<Database['interopAggregateStatus']>({
        getLatestPromotedTimestamp: mockFn().resolvesTo(undefined),
      }),
    })

    await expect(
      resolveInteropTransferTimeRange(db, 'lastPromoted'),
    ).toBeRejectedWith('No promoted aggregate snapshot is available.')
  })
})
