import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { InteropHistoryData } from '~/server/features/layer2s/interop/history/types'
import { findZeroDays } from './findZeroDays'

describe(findZeroDays.name, () => {
  it('marks a day without transfers for a usually active protocol', () => {
    expect(findZeroDays(data([400, 420, 0, 410, 390]))).toEqual([
      { point: 2, id: 'relay', usual: 405 },
    ])
  })

  it('ignores quiet days that are not zero, and usually quiet protocols', () => {
    expect(findZeroDays(data([400, 420, 3, 410, 390]))).toEqual([])
    expect(findZeroDays(data([10, 12, 0, 11, 9]))).toEqual([])
  })

  it('does not count a missing snapshot as a zero day', () => {
    expect(findZeroDays(data([400, 420, 0, 410, 390], [2]))).toEqual([])
  })
})

function data(counts: number[], missing: number[] = []): InteropHistoryData {
  const zeros = counts.map(() => 0)
  return {
    resolution: 'daily',
    points: counts.map((_, i) => ({
      timestamp: i * UnixTime.DAY,
      snapshot: missing.includes(i) ? null : i * UnixTime.DAY,
      isBlocked: false,
      carriedLanes: 0,
      partialLanes: 0,
    })),
    protocols: [],
    byProtocol: {
      relay: {
        volume: zeros,
        transferCount: counts,
        timedTransferCount: zeros,
        durationSum: zeros,
      },
    },
    byChain: {},
    laneCandidates: [],
    tokenCandidates: [],
  }
}
