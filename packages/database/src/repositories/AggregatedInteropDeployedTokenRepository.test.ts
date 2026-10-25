import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type AggregatedInteropDeployedTokenRecord,
  AggregatedInteropDeployedTokenRepository,
} from './AggregatedInteropDeployedTokenRepository'
import type { AggregatedInteropTransferRecord } from './AggregatedInteropTransferRepository'

describeDatabase(AggregatedInteropDeployedTokenRepository.name, (db) => {
  const repository = db.aggregatedInteropDeployedToken

  beforeEach(async () => {
    await repository.deleteAll()
    await db.aggregatedInteropTransfer.deleteAll()
  })

  describe(
    AggregatedInteropDeployedTokenRepository.prototype.getDailyStatsSince.name,
    () => {
      it('sums the earliest snapshot of each day after the start', async () => {
        const day1 = UnixTime(10 * UnixTime.DAY)
        const day2 = UnixTime(11 * UnixTime.DAY)
        const snapshots = [
          day1 - UnixTime.HOUR,
          day1,
          day1 + UnixTime.HOUR,
          day2 + 2 * UnixTime.HOUR,
          day2 + 3 * UnixTime.HOUR,
        ].map(UnixTime)
        await db.aggregatedInteropTransfer.insertMany(
          snapshots.map((timestamp) => lane(timestamp)),
        )
        await repository.insertMany([
          deployedToken({ timestamp: snapshots[0]!, volume: 1 }),
          deployedToken({ timestamp: snapshots[1]!, volume: 10 }),
          deployedToken({ timestamp: snapshots[2]!, volume: 100 }),
          deployedToken({ timestamp: snapshots[3]!, volume: 1_000 }),
          deployedToken({ timestamp: snapshots[4]!, volume: 10_000 }),
          deployedToken({
            timestamp: snapshots[3]!,
            tokenAddress: '0xother',
            volume: 5,
          }),
        ])

        const result = await repository.getDailyStatsSince(
          UnixTime(day1 - UnixTime.HOUR),
        )

        expect(result).toEqualUnsorted([
          {
            id: 'base',
            bridgeType: 'lockAndMint',
            srcChain: 'ethereum',
            dstChain: 'base',
            tokenChain: 'base',
            tokenAddress: '0xtoken',
            volume: 1_010,
            transferCount: 2,
            lastSeen: snapshots[3]!,
          },
          {
            id: 'base',
            bridgeType: 'lockAndMint',
            srcChain: 'ethereum',
            dstChain: 'base',
            tokenChain: 'base',
            tokenAddress: '0xother',
            volume: 5,
            transferCount: 1,
            lastSeen: snapshots[3]!,
          },
        ])
      })

      it('returns nothing when there are no snapshots in range', async () => {
        await db.aggregatedInteropTransfer.insertMany([lane(UnixTime(100))])
        await repository.insertMany([
          deployedToken({ timestamp: UnixTime(100), volume: 1 }),
        ])

        expect(await repository.getDailyStatsSince(UnixTime(100))).toEqual([])
      })
    },
  )
})

function deployedToken(
  overrides: Partial<AggregatedInteropDeployedTokenRecord> & {
    timestamp: UnixTime
  },
): AggregatedInteropDeployedTokenRecord {
  return {
    id: 'base',
    bridgeType: 'lockAndMint',
    srcChain: 'ethereum',
    dstChain: 'base',
    tokenChain: 'base',
    tokenAddress: '0xtoken',
    transferTypeStats: undefined,
    transferCount: 1,
    transfersWithDurationCount: 0,
    totalDurationSum: 0,
    volume: 0,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
    ...overrides,
  }
}

function lane(timestamp: UnixTime): AggregatedInteropTransferRecord {
  return {
    timestamp,
    id: 'base',
    srcChain: 'ethereum',
    dstChain: 'base',
    bridgeType: 'lockAndMint',
    transferTypeStats: undefined,
    transferCount: 1,
    transfersWithDurationCount: 0,
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
    carriedFrom: undefined,
    isPartial: false,
  }
}
