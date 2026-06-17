import type { AggregatedInteropTransferRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { maxLaneVolumeRule } from './rules'
import type { PromotionContext } from './types'

describe('promotion rules', () => {
  describe(maxLaneVolumeRule.name, () => {
    it('flags each over-threshold lane (max of src/dst) with a stable scope', () => {
      const ctx = context([
        transfer({
          id: 'a',
          srcChain: 'ethereum',
          dstChain: 'base',
          srcValueUsd: 2000,
          dstValueUsd: 1900,
        }),
        transfer({ srcValueUsd: 100, dstValueUsd: 100 }),
      ])

      const violations = maxLaneVolumeRule(1000).evaluate(ctx)

      expect(violations).toHaveLength(1)
      expect(violations[0]?.scope).toEqual('a|nonMinting|ethereum|base')
      expect(violations[0]?.value).toEqual(2000)
    })

    it('passes when every lane is under the threshold and treats missing values as zero', () => {
      const ctx = context([
        transfer({ srcValueUsd: 900, dstValueUsd: 900 }),
        transfer({ srcValueUsd: undefined, dstValueUsd: undefined }),
      ])

      expect(maxLaneVolumeRule(1000).evaluate(ctx)).toEqual([])
    })
  })
})

function context(
  transfers: AggregatedInteropTransferRecord[],
): PromotionContext {
  return { timestamp: UnixTime(100), transfers, tokens: [] }
}

function transfer(
  overrides: Partial<AggregatedInteropTransferRecord>,
): AggregatedInteropTransferRecord {
  return {
    timestamp: UnixTime(100),
    id: 'p',
    bridgeType: 'nonMinting',
    srcChain: 'ethereum',
    dstChain: 'base',
    transferTypeStats: undefined,
    transferCount: 1,
    transfersWithDurationCount: 1,
    identifiedCount: 1,
    totalDurationSum: 0,
    srcValueUsd: undefined,
    dstValueUsd: undefined,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    avgValueInFlight: undefined,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
    countUnder100: 0,
    count100To1K: 0,
    count1KTo10K: 0,
    count10KTo100K: 0,
    countOver100K: 0,
    ...overrides,
  }
}
