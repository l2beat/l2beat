import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { resolveInteropTransferTimeRange } from './transferDataRange'

describe(resolveInteropTransferTimeRange.name, () => {
  it('uses a rolling 24-hour window', async () => {
    const range = await resolveInteropTransferTimeRange(
      mockObject<Database>({}),
      'last24h',
    )

    if (range === undefined) {
      throw new Error('Expected a default time range')
    }

    expect(range.to - range.from).toStrictEqual(UnixTime.DAY)
  })

  it('uses the latest promoted aggregate as the window end', async () => {
    const getLatestPromotedTimestamp = vi
      .fn()
      .mockResolvedValue(UnixTime(500_000))
    const db = mockObject<Database>({
      interopAggregateStatus: mockObject<Database['interopAggregateStatus']>({
        getLatestPromotedTimestamp,
      }),
    })

    const range = await resolveInteropTransferTimeRange(db, 'lastPromoted')

    expect(getLatestPromotedTimestamp).toHaveBeenCalledExactlyOnceWith()
    expect(range).toStrictEqual({
      from: UnixTime(500_000 - UnixTime.DAY),
      to: UnixTime(500_000),
    })
  })

  it('leaves the query unbounded only when all retained data is selected', async () => {
    const range = await resolveInteropTransferTimeRange(
      mockObject<Database>({}),
      'all',
    )

    expect(range).toStrictEqual(undefined)
  })

  it('does not turn a missing promoted aggregate into an unbounded query', async () => {
    const db = mockObject<Database>({
      interopAggregateStatus: mockObject<Database['interopAggregateStatus']>({
        getLatestPromotedTimestamp: vi.fn().mockResolvedValue(undefined),
      }),
    })

    await expect(
      resolveInteropTransferTimeRange(db, 'lastPromoted'),
    ).rejects.toThrow('No promoted aggregate snapshot is available.')
  })
})
