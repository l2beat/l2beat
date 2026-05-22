import type {
  ActivityRecord,
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
} from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getLargestTokenVolumeIncrease,
  getLargestUopsCountIncrease,
  getTopPathByVolumeAtTimestamp,
} from './highlightsCalculations'

describe('highlightsCalculations', () => {
  describe(getTopPathByVolumeAtTimestamp.name, () => {
    it('returns the highest-volume cross-chain path with protocol distinct count', () => {
      const timestamp = UnixTime(500)

      const result = getTopPathByVolumeAtTimestamp(
        [
          transferRecord({
            id: 'across',
            timestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            transferCount: 100,
            srcValueUsd: 900_000,
            dstValueUsd: 1_000_000,
          }),
          transferRecord({
            id: 'stargate',
            timestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            transferCount: 23,
            srcValueUsd: 200_000,
          }),
          transferRecord({
            id: 'relay',
            timestamp,
            srcChain: 'base',
            dstChain: 'optimism',
            transferCount: 400,
            srcValueUsd: 500_000,
            dstValueUsd: 500_000,
          }),
          transferRecord({
            id: 'same-chain',
            timestamp,
            srcChain: 'base',
            dstChain: 'base',
            transferCount: 1,
            srcValueUsd: 9_000_000,
            dstValueUsd: 9_000_000,
          }),
        ],
        timestamp,
      )

      expect(result).toEqual({
        timestamp,
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        volumeUsd: 1_200_000,
        transferCount: 123,
        protocolCount: 2,
      })
    })
  })

  describe(getLargestTokenVolumeIncrease.name, () => {
    it('returns the token with the largest positive volume increase', () => {
      const previousTimestamp = UnixTime(100)
      const timestamp = UnixTime(200)

      const result = getLargestTokenVolumeIncrease(
        [
          tokenRecord({
            id: 'across',
            timestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            abstractTokenId: 'eth',
            volume: 1_200,
          }),
          tokenRecord({
            id: 'stargate',
            timestamp,
            srcChain: 'base',
            dstChain: 'optimism',
            abstractTokenId: 'eth',
            volume: 300,
          }),
          tokenRecord({
            id: 'relay',
            timestamp,
            srcChain: 'base',
            dstChain: 'optimism',
            abstractTokenId: 'usdc',
            volume: 900,
          }),
          tokenRecord({
            id: 'same-chain',
            timestamp,
            srcChain: 'base',
            dstChain: 'base',
            abstractTokenId: 'usdc',
            volume: 9_000,
          }),
        ],
        [
          tokenRecord({
            id: 'across',
            timestamp: previousTimestamp,
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            abstractTokenId: 'eth',
            volume: 500,
          }),
          tokenRecord({
            id: 'relay',
            timestamp: previousTimestamp,
            srcChain: 'base',
            dstChain: 'optimism',
            abstractTokenId: 'usdc',
            volume: 100,
          }),
        ],
        timestamp,
      )

      expect(result).toEqual({
        timestamp,
        abstractTokenId: 'eth',
        currentVolumeUsd: 1_500,
        previousVolumeUsd: 500,
        increaseUsd: 1_000,
      })
    })
  })

  describe(getLargestUopsCountIncrease.name, () => {
    it('returns project with largest positive UOPS percentage increase', () => {
      const previousPreviousTimestamp = UnixTime(1_700_000_000)
      const previousTimestamp = previousPreviousTimestamp + UnixTime.DAY
      const timestamp = previousPreviousTimestamp + 2 * UnixTime.DAY

      const result = getLargestUopsCountIncrease(
        [
          activityRecord('ethereum', timestamp, 50),
          activityRecord('lighter', timestamp, 1250),
        ],
        [
          activityRecord('ethereum', previousTimestamp, 20),
          activityRecord('lighter', previousTimestamp, 1200),
        ],
        [
          activityRecord('ethereum', previousPreviousTimestamp, 18),
          activityRecord('lighter', previousPreviousTimestamp, 1100),
        ],
        timestamp,
      )

      expect(result).toEqual({
        timestamp,
        projectId: ProjectId('ethereum'),
        currentUopsCount: 50,
        previousUopsCount: 20,
        increase: 30,
        increasePercent: 150,
      })
    })
  })
})

function transferRecord(
  overrides: Partial<AggregatedInteropTransferRecord> &
    Pick<
      AggregatedInteropTransferRecord,
      'timestamp' | 'id' | 'srcChain' | 'dstChain'
    >,
): AggregatedInteropTransferRecord {
  return {
    bridgeType: 'lockAndMint',
    transferTypeStats: undefined,
    transfersWithDurationCount: 0,
    identifiedCount: 0,
    totalDurationSum: 0,
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
    transferCount: 0,
    srcValueUsd: undefined,
    dstValueUsd: undefined,
    ...overrides,
  }
}

function tokenRecord(
  overrides: Partial<AggregatedInteropTokenRecord> &
    Pick<
      AggregatedInteropTokenRecord,
      'timestamp' | 'id' | 'srcChain' | 'dstChain' | 'abstractTokenId'
    >,
): AggregatedInteropTokenRecord {
  return {
    bridgeType: 'lockAndMint',
    transferTypeStats: undefined,
    transferCount: 0,
    transfersWithDurationCount: 0,
    totalDurationSum: 0,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
    volume: 0,
    ...overrides,
  }
}

function activityRecord(
  projectId: string,
  timestamp: UnixTime,
  uopsCount: number,
): ActivityRecord {
  return {
    projectId: ProjectId(projectId),
    timestamp,
    count: uopsCount,
    uopsCount,
    start: 1,
    end: 2,
  }
}
