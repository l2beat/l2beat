import type { ActivityHeadBlockRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { toLiveBlocks } from './liveBlocks'

const T0 = UnixTime.fromDate(new Date('2026-11-05T12:00:00Z'))

describe(toLiveBlocks.name, () => {
  it('rates each block over the time since the block before it', () => {
    // Block 102 came after a missed slot, so its txs spread over 24 s
    const result = toLiveBlocks(
      [block(100, T0, 120), block(101, T0 + 12, 240), block(102, T0 + 36, 48)],
      UnixTime.MINUTE,
    )

    expect(result).toEqual([
      {
        number: 101,
        timestamp: T0 + 12,
        count: 240,
        uopsCount: 240,
        seconds: 12,
      },
      {
        number: 102,
        timestamp: T0 + 36,
        count: 48,
        uopsCount: 48,
        seconds: 24,
      },
    ])
  })

  it('keeps the blocks of the window before the newest', () => {
    const blocks = Array.from({ length: 40 }, (_, i) =>
      block(100 + i, T0 + i * 12, 10),
    )

    const result = toLiveBlocks(blocks, 5 * UnixTime.MINUTE)

    // 300 s back from block 139 is block 114, exclusive
    expect(result.map((b) => b.number)).toEqual(
      Array.from({ length: 25 }, (_, i) => 115 + i),
    )
  })

  it('keeps only the unbroken run up to the newest block', () => {
    const result = toLiveBlocks(
      [block(100, T0, 1), block(102, T0 + 24, 2), block(103, T0 + 36, 3)],
      UnixTime.HOUR,
    )

    expect(result.map((b) => b.number)).toEqual([103])
  })

  it('counts transactions for blocks without user operations', () => {
    const result = toLiveBlocks(
      [block(100, T0, 1), { ...block(101, T0 + 12, 7), uopsCount: null }],
      UnixTime.HOUR,
    )

    expect(result[0]?.uopsCount).toEqual(7)
  })
})

function block(
  number: number,
  timestamp: UnixTime,
  count: number,
): ActivityHeadBlockRecord {
  return {
    projectId: ProjectId.ETHEREUM,
    number,
    timestamp,
    count,
    uopsCount: count,
  }
}
