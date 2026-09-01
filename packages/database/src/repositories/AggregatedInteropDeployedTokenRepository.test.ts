import { type InteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type AggregatedInteropDeployedTokenRecord,
  AggregatedInteropDeployedTokenRepository,
} from './AggregatedInteropDeployedTokenRepository'

describeDatabase(AggregatedInteropDeployedTokenRepository.name, (db) => {
  const repository = db.aggregatedInteropDeployedToken

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(
    AggregatedInteropDeployedTokenRepository.prototype
      .getSummedStatsByTimestampAndTokens.name,
    () => {
      it('returns empty array when no tokens are given', async () => {
        await repository.insertMany([
          record({
            id: 'id1',
            timestamp: UnixTime(100),
            tokenChain: 'ethereum',
            tokenAddress: '0x1',
          }),
        ])

        const result = await repository.getSummedStatsByTimestampAndTokens(
          UnixTime(100),
          [],
        )

        expect(result).toEqual([])
      })

      it('sums stats per token across flows at the given timestamp', async () => {
        await repository.insertMany([
          record({
            id: 'flow1',
            timestamp: UnixTime(100),
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            tokenChain: 'ethereum',
            tokenAddress: '0x1',
            transferCount: 2,
            transfersWithDurationCount: 2,
            totalDurationSum: 20,
            volume: 1000,
          }),
          record({
            id: 'flow2',
            timestamp: UnixTime(100),
            srcChain: 'base',
            dstChain: 'ethereum',
            tokenChain: 'ethereum',
            tokenAddress: '0x1',
            transferCount: 3,
            transfersWithDurationCount: 1,
            totalDurationSum: 40,
            volume: 500,
          }),
          // different token - excluded from the first token's sums
          record({
            id: 'flow1',
            timestamp: UnixTime(100),
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            tokenChain: 'arbitrum',
            tokenAddress: '0x2',
            transferCount: 7,
            transfersWithDurationCount: 7,
            totalDurationSum: 70,
            volume: 2000,
          }),
          // other timestamp - excluded
          record({
            id: 'flow1',
            timestamp: UnixTime(200),
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            tokenChain: 'ethereum',
            tokenAddress: '0x1',
            transferCount: 100,
            volume: 9999,
          }),
          // token not in the query - excluded
          record({
            id: 'flow1',
            timestamp: UnixTime(100),
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            tokenChain: 'optimism',
            tokenAddress: '0x3',
            transferCount: 5,
            volume: 300,
          }),
        ])

        const result = await repository.getSummedStatsByTimestampAndTokens(
          UnixTime(100),
          [
            { tokenChain: 'ethereum', tokenAddress: '0x1' },
            { tokenChain: 'arbitrum', tokenAddress: '0x2' },
          ],
        )

        result.sort((a, b) => a.tokenChain.localeCompare(b.tokenChain))
        expect(result).toEqual([
          {
            tokenChain: 'arbitrum',
            tokenAddress: '0x2',
            transferCount: 7,
            transfersWithDurationCount: 7,
            totalDurationSum: 70,
            volume: 2000,
          },
          {
            tokenChain: 'ethereum',
            tokenAddress: '0x1',
            transferCount: 5,
            transfersWithDurationCount: 3,
            totalDurationSum: 60,
            volume: 1500,
          },
        ])
      })
    },
  )
})

function record({
  id,
  timestamp,
  srcChain = 'ethereum',
  dstChain = 'arbitrum',
  bridgeType = 'unknown',
  tokenChain,
  tokenAddress,
  transferCount = 1,
  transfersWithDurationCount = transferCount,
  totalDurationSum = 0,
  volume = 1000,
}: {
  id: string
  timestamp: UnixTime
  srcChain?: string
  dstChain?: string
  bridgeType?: InteropBridgeType
  tokenChain: string
  tokenAddress: string
  transferCount?: number
  transfersWithDurationCount?: number
  totalDurationSum?: number
  volume?: number
}): AggregatedInteropDeployedTokenRecord {
  return {
    id,
    timestamp,
    srcChain,
    dstChain,
    bridgeType,
    tokenChain,
    tokenAddress,
    transferTypeStats: undefined,
    transferCount,
    transfersWithDurationCount,
    totalDurationSum,
    volume,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
  }
}
