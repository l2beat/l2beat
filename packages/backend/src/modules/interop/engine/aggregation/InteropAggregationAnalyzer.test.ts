import type {
  AggregatedInteropTransferRecord,
  Database,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { DefaultInteropAggregationAnalyzer } from './InteropAggregationAnalyzer'

describe(DefaultInteropAggregationAnalyzer.name, () => {
  const candidateTimestamp = UnixTime(20 * UnixTime.DAY + 12 * UnixTime.HOUR)
  const candidateDay = UnixTime.toStartOf(candidateTimestamp, 'day')

  it('flags a group whose candidate diverges from a healthy 14-day history', async () => {
    const aggregatedInteropTransfer = mockObject<
      Database['aggregatedInteropTransfer']
    >({
      getGroupsWithStatsInTimeRange: mockFn().resolvesTo([]),
      getDailyStatsForGroupInTimeRange: mockFn().resolvesTo(
        baselineHistory(candidateTimestamp),
      ),
    })
    const db = mockObject<Database>({ aggregatedInteropTransfer })
    const analyzer = new DefaultInteropAggregationAnalyzer(db)

    const result = await analyzer.analyze(candidateTimestamp, [
      candidateTransfer({
        timestamp: candidateTimestamp,
        id: 'stargate',
        bridgeType: 'nonMinting',
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        transferCount: 20_000,
        identifiedCount: 19_000,
        srcValueUsd: 60_000_000,
        dstValueUsd: 55_000_000,
      }),
    ])

    expect(result.checkedGroups).toEqual(1)
    expect(result.suspiciousGroups).toHaveLength(1)
    const group = result.suspiciousGroups[0]
    expect(group?.id).toEqual('stargate')
    expect(group?.bridgeType).toEqual('nonMinting')
    expect(group?.srcChain).toEqual('ethereum')
    expect(group?.dstChain).toEqual('arbitrum')
    expect(group?.reasons.length).toBeGreaterThan(0)
    expect(group?.evaluation.signals.some((s) => s.metric === 'count')).toEqual(
      true,
    )

    expect(
      aggregatedInteropTransfer.getDailyStatsForGroupInTimeRange,
    ).toHaveBeenCalledWith(
      'stargate',
      'nonMinting',
      'ethereum',
      'arbitrum',
      candidateDay - 13 * UnixTime.DAY,
      candidateDay,
    )
  })

  it('analyzes historically active groups that are missing from the current snapshot', async () => {
    const aggregatedInteropTransfer = mockObject<
      Database['aggregatedInteropTransfer']
    >({
      getGroupsWithStatsInTimeRange: mockFn().resolvesTo([
        {
          id: 'stargate',
          bridgeType: 'nonMinting',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
        },
      ]),
      getDailyStatsForGroupInTimeRange: mockFn().resolvesTo(
        baselineHistory(candidateTimestamp),
      ),
    })
    const db = mockObject<Database>({ aggregatedInteropTransfer })
    const analyzer = new DefaultInteropAggregationAnalyzer(db)

    const result = await analyzer.analyze(candidateTimestamp, [])

    expect(result.checkedGroups).toEqual(1)
    expect(result.suspiciousGroups).toHaveLength(1)
    const group = result.suspiciousGroups[0]
    expect(group?.id).toEqual('stargate')
    expect(group?.evaluation.signals[0]?.metric).toEqual('count')
    expect(['ratioDrop', 'zScoreDrop']).toInclude(
      group?.evaluation.signals[0]?.kind,
    )

    expect(
      aggregatedInteropTransfer.getGroupsWithStatsInTimeRange,
    ).toHaveBeenCalledWith(candidateDay - 13 * UnixTime.DAY, candidateDay)
  })

  it('does not flag a group whose baseline is below the count floor', async () => {
    const aggregatedInteropTransfer = mockObject<
      Database['aggregatedInteropTransfer']
    >({
      getGroupsWithStatsInTimeRange: mockFn().resolvesTo([]),
      getDailyStatsForGroupInTimeRange: mockFn().resolvesTo(
        sparseHistory(candidateTimestamp),
      ),
    })
    const db = mockObject<Database>({ aggregatedInteropTransfer })
    const analyzer = new DefaultInteropAggregationAnalyzer(db)

    const result = await analyzer.analyze(candidateTimestamp, [
      candidateTransfer({
        timestamp: candidateTimestamp,
        id: 'tiny-route',
        transferCount: 5,
        identifiedCount: 5,
        srcValueUsd: 100,
        dstValueUsd: 100,
      }),
    ])

    expect(result.suspiciousGroups).toEqual([])
  })
})

function baselineHistory(candidateTimestamp: UnixTime) {
  return [
    pointAt(candidateTimestamp, -13, {
      transferCount: 900,
      identifiedCount: 860,
      srcVolumeUsd: 1_900_000,
      dstVolumeUsd: 1_940_000,
    }),
    pointAt(candidateTimestamp, -12, {
      transferCount: 980,
      identifiedCount: 940,
      srcVolumeUsd: 2_050_000,
      dstVolumeUsd: 2_020_000,
    }),
    pointAt(candidateTimestamp, -11, {
      transferCount: 1_040,
      identifiedCount: 980,
      srcVolumeUsd: 2_150_000,
      dstVolumeUsd: 2_110_000,
    }),
    pointAt(candidateTimestamp, -10, {
      transferCount: 1_000,
      identifiedCount: 960,
      srcVolumeUsd: 2_000_000,
      dstVolumeUsd: 2_030_000,
    }),
    pointAt(candidateTimestamp, -9, {
      transferCount: 1_100,
      identifiedCount: 1_040,
      srcVolumeUsd: 2_120_000,
      dstVolumeUsd: 2_140_000,
    }),
    pointAt(candidateTimestamp, -8, {
      transferCount: 950,
      identifiedCount: 900,
      srcVolumeUsd: 1_970_000,
      dstVolumeUsd: 1_980_000,
    }),
    pointAt(candidateTimestamp, -7, {
      transferCount: 1_020,
      identifiedCount: 980,
      srcVolumeUsd: 2_010_000,
      dstVolumeUsd: 1_990_000,
    }),
    pointAt(candidateTimestamp, -6, {
      transferCount: 995,
      identifiedCount: 950,
      srcVolumeUsd: 1_995_000,
      dstVolumeUsd: 2_005_000,
    }),
    pointAt(candidateTimestamp, -5, {
      transferCount: 1_015,
      identifiedCount: 970,
      srcVolumeUsd: 2_025_000,
      dstVolumeUsd: 2_010_000,
    }),
    pointAt(candidateTimestamp, -4, {
      transferCount: 990,
      identifiedCount: 945,
      srcVolumeUsd: 1_980_000,
      dstVolumeUsd: 1_970_000,
    }),
    pointAt(candidateTimestamp, -3, {
      transferCount: 1_030,
      identifiedCount: 985,
      srcVolumeUsd: 2_040_000,
      dstVolumeUsd: 2_020_000,
    }),
    pointAt(candidateTimestamp, -2, {
      transferCount: 1_005,
      identifiedCount: 960,
      srcVolumeUsd: 2_000_000,
      dstVolumeUsd: 1_995_000,
    }),
    pointAt(candidateTimestamp, -1, {
      transferCount: 985,
      identifiedCount: 940,
      srcVolumeUsd: 1_990_000,
      dstVolumeUsd: 1_985_000,
    }),
  ]
}

function sparseHistory(candidateTimestamp: UnixTime) {
  return [
    pointAt(candidateTimestamp, -10, {
      transferCount: 1,
      identifiedCount: 1,
      srcVolumeUsd: 50,
      dstVolumeUsd: 50,
    }),
    pointAt(candidateTimestamp, -5, {
      transferCount: 1,
      identifiedCount: 1,
      srcVolumeUsd: 50,
      dstVolumeUsd: 50,
    }),
    pointAt(candidateTimestamp, -2, {
      transferCount: 1,
      identifiedCount: 1,
      srcVolumeUsd: 50,
      dstVolumeUsd: 50,
    }),
  ]
}

function pointAt(
  candidateTimestamp: UnixTime,
  offsetDays: number,
  overrides: Partial<{
    transferCount: number
    identifiedCount: number
    srcVolumeUsd: number
    dstVolumeUsd: number
  }> = {},
) {
  return {
    timestamp:
      UnixTime.toStartOf(candidateTimestamp, 'day') + offsetDays * UnixTime.DAY,
    transferCount: 1_000,
    identifiedCount: 950,
    srcVolumeUsd: 2_000_000,
    dstVolumeUsd: 2_000_000,
    ...overrides,
  }
}

function candidateTransfer(
  overrides: Partial<AggregatedInteropTransferRecord>,
): AggregatedInteropTransferRecord {
  return {
    timestamp: UnixTime(1),
    id: 'id',
    bridgeType: 'nonMinting',
    srcChain: 'ethereum',
    dstChain: 'arbitrum',
    transferTypeStats: undefined,
    transferCount: 1,
    transfersWithDurationCount: 0,
    identifiedCount: 1,
    totalDurationSum: 0,
    srcValueUsd: 0,
    dstValueUsd: 0,
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
