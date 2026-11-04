import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type AggregatedInteropDeployedTokenRecord,
  AggregatedInteropDeployedTokenRepository,
  type AggregatedInteropDeployedTokenStats,
} from './AggregatedInteropDeployedTokenRepository'

describeDatabase(AggregatedInteropDeployedTokenRepository.name, (db) => {
  const repository = db.aggregatedInteropDeployedToken

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(
    AggregatedInteropDeployedTokenRepository.prototype.getSummedByTimestamps
      .name,
    () => {
      it('sums the given snapshots per bridge and token', async () => {
        const day1 = UnixTime(10 * UnixTime.DAY)
        const day1Later = UnixTime(day1 + UnixTime.HOUR)
        const day2 = UnixTime(11 * UnixTime.DAY)
        await repository.insertMany([
          deployedToken({ timestamp: day1, volume: 10 }),
          deployedToken({ timestamp: day1Later, volume: 100 }),
          deployedToken({ timestamp: day2, volume: 1_000 }),
          deployedToken({
            timestamp: day2,
            tokenAddress: '0xother',
            volume: 5,
          }),
        ])

        const result = await repository.getSummedByTimestamps([day1, day2])

        expect(result).toEqualUnsorted([
          stats({ volume: 1_010, transferCount: 2, lastSeen: day2 }),
          stats({
            tokenAddress: '0xother',
            volume: 5,
            transferCount: 1,
            lastSeen: day2,
          }),
        ])
      })

      it('returns nothing for no timestamps', async () => {
        await repository.insertMany([
          deployedToken({ timestamp: UnixTime(100), volume: 1 }),
        ])

        expect(await repository.getSummedByTimestamps([])).toEqual([])
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

function stats(
  overrides: Partial<AggregatedInteropDeployedTokenStats>,
): AggregatedInteropDeployedTokenStats {
  return {
    id: 'base',
    bridgeType: 'lockAndMint',
    srcChain: 'ethereum',
    dstChain: 'base',
    tokenChain: 'base',
    tokenAddress: '0xtoken',
    volume: 0,
    transferCount: 0,
    lastSeen: UnixTime(0),
    ...overrides,
  }
}
