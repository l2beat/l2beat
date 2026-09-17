import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import { resolveInteropTransferTimeRange } from './transferDataRange'

describe(resolveInteropTransferTimeRange.name, () => {
  it('uses a rolling 24-hour window', async () => {
    const range = await resolveInteropTransferTimeRange(
      {} as unknown as Database,
      'last24h',
    )

    if (range === undefined) {
      throw new Error('Expected a default time range')
    }

    expect(range.to - range.from).toEqual(UnixTime.DAY)
  })

  it('uses the latest promoted aggregate as the window end', async () => {
    const getLatestPromotedTimestamp = vi
      .fn()
      .mockResolvedValue(UnixTime(500_000))
    const db = {
      interopAggregateStatus: {
        getLatestPromotedTimestamp,
      } as unknown as Database['interopAggregateStatus'],
    } as unknown as Database

    const range = await resolveInteropTransferTimeRange(db, 'lastPromoted')

    expect(getLatestPromotedTimestamp).toHaveBeenCalledExactlyOnceWith()
    expect(range).toEqual({
      from: UnixTime(500_000 - UnixTime.DAY),
      to: UnixTime(500_000),
    })
  })

  it('leaves the query unbounded only when all retained data is selected', async () => {
    const range = await resolveInteropTransferTimeRange(
      {} as unknown as Database,
      'all',
    )

    expect(range).toBe(undefined)
  })

  it('does not turn a missing promoted aggregate into an unbounded query', async () => {
    const db = {
      interopAggregateStatus: {
        getLatestPromotedTimestamp: vi.fn().mockResolvedValue(undefined),
      } as unknown as Database['interopAggregateStatus'],
    } as unknown as Database

    await expect(
      resolveInteropTransferTimeRange(db, 'lastPromoted'),
    ).rejects.toThrow('No promoted aggregate snapshot is available.')
  })
})
