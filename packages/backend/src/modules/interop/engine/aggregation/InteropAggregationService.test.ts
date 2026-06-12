import type { InteropTransferRecord } from '@l2beat/database'
import { InteropTransferClassifier } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { InteropAggregationConfig } from '../../../../config/features/interop'
import { InteropAggregationService } from './InteropAggregationService'

describe(InteropAggregationService.name, () => {
  describe(InteropAggregationService.prototype.aggregate.name, () => {
    it('aggregates transfers, tokens and pairs correctly', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer('across', 'msg1', 'deposit', to - UnixTime.HOUR, {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
          srcWasBurned: false,
          dstWasMinted: true,
        }),
        createTransfer('across', 'msg2', 'deposit', to - 2 * UnixTime.HOUR, {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 6000,
          srcValueUsd: 3000,
          dstValueUsd: 3000,
          srcWasBurned: false,
          dstWasMinted: true,
        }),
      ]

      const configs: InteropAggregationConfig[] = [
        {
          id: 'config1',
          plugins: [{ plugin: 'across', bridgeType: 'lockAndMint' }],
          type: 'other',
        },
      ]

      const classifier = new InteropTransferClassifier()
      const service = new InteropAggregationService(classifier)

      const result = service.aggregate(transfers, configs, to)

      expect(result.aggregatedTransfers).toHaveLength(1)
      expect(result.aggregatedTransfers[0]).toEqual({
        timestamp: to,
        id: 'config1',
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        transferTypeStats: {
          deposit: { transferCount: 2, totalDurationSum: 11000 },
        },
        transferCount: 2,
        transfersWithDurationCount: 2,
        totalDurationSum: 11000,
        srcValueUsd: 5000,
        dstValueUsd: 5000,
        minTransferValueUsd: 2000,
        maxTransferValueUsd: 3000,
        avgValueInFlight: undefined,
        countUnder100: 0,
        count100To1K: 0,
        count1KTo10K: 2,
        count10KTo100K: 0,
        countOver100K: 0,
        identifiedCount: 2,
        mintedValueUsd: 5000,
        burnedValueUsd: undefined,
        bridgeType: 'lockAndMint',
      })

      expect(result.aggregatedTokens).toHaveLength(1)
      expect(result.aggregatedTokens[0]).toEqual({
        timestamp: to,
        id: 'config1',
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        abstractTokenId: 'eth',
        transferTypeStats: {
          deposit: { transferCount: 2, totalDurationSum: 11000 },
        },
        transferCount: 2,
        transfersWithDurationCount: 2,
        totalDurationSum: 11000,
        volume: 5000,
        minTransferValueUsd: 2000,
        maxTransferValueUsd: 3000,
        bridgeType: 'lockAndMint',
        mintedValueUsd: 5000,
        burnedValueUsd: 0,
      })

      expect(result.aggregatedTokensPairs).toHaveLength(1)
      expect(result.aggregatedTokensPairs[0]).toEqual({
        timestamp: to,
        id: 'config1',
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        tokenA: 'eth',
        tokenB: 'eth',
        transferTypeStats: {
          deposit: { transferCount: 2, totalDurationSum: 11000 },
        },
        transferCount: 2,
        transfersWithDurationCount: 2,
        totalDurationSum: 11000,
        volume: 5000,
        minTransferValueUsd: 2000,
        maxTransferValueUsd: 3000,
        bridgeType: 'lockAndMint',
      })
    })

    it('groups transfers by bridge type and chain pairs', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer('across', 'msg1', 'deposit', to - UnixTime.HOUR, {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
          srcWasBurned: false,
          dstWasMinted: true,
        }),
        createTransfer('across', 'msg2', 'deposit', to - 2 * UnixTime.HOUR, {
          srcChain: 'ethereum',
          dstChain: 'polygon',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 6000,
          srcValueUsd: 3000,
          dstValueUsd: 3000,
          srcWasBurned: false,
          dstWasMinted: true,
        }),
      ]

      const configs: InteropAggregationConfig[] = [
        {
          id: 'config1',
          plugins: [{ plugin: 'across', bridgeType: 'lockAndMint' }],
          type: 'other',
        },
      ]

      const classifier = new InteropTransferClassifier()
      const service = new InteropAggregationService(classifier)

      const result = service.aggregate(transfers, configs, to)

      expect(result.aggregatedTransfers).toHaveLength(2)
      expect(result.aggregatedTransfers[0].srcChain).toEqual('ethereum')
      expect(result.aggregatedTransfers[0].dstChain).toEqual('arbitrum')
      expect(result.aggregatedTransfers[1].srcChain).toEqual('ethereum')
      expect(result.aggregatedTransfers[1].dstChain).toEqual('polygon')

      expect(result.aggregatedTokensPairs).toHaveLength(2)
      expect(result.aggregatedTokensPairs[0].srcChain).toEqual('ethereum')
      expect(result.aggregatedTokensPairs[0].dstChain).toEqual('arbitrum')
      expect(result.aggregatedTokensPairs[1].srcChain).toEqual('ethereum')
      expect(result.aggregatedTokensPairs[1].dstChain).toEqual('polygon')
    })

    it('calculates average value in flight for nonMinting bridge type', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer('across', 'msg1', 'deposit', to - UnixTime.HOUR, {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: UnixTime.DAY,
          srcValueUsd: 1,
          dstValueUsd: 1,
          srcWasBurned: false,
          dstWasMinted: false,
        }),
      ]

      const configs: InteropAggregationConfig[] = [
        {
          id: 'config1',
          plugins: [{ plugin: 'across', bridgeType: 'nonMinting' }],
          type: 'other',
        },
      ]

      const classifier = new InteropTransferClassifier()
      const service = new InteropAggregationService(classifier)

      const result = service.aggregate(transfers, configs, to)

      expect(result.aggregatedTransfers[0].avgValueInFlight).toEqual(1)
    })

    it('handles multiple configs correctly', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer('across', 'msg1', 'deposit', to - UnixTime.HOUR, {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: 2000,
          srcWasBurned: false,
          dstWasMinted: true,
        }),
        createTransfer('stargate', 'msg2', 'deposit', to - 2 * UnixTime.HOUR, {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          duration: 6000,
          srcValueUsd: 3000,
          dstValueUsd: 3000,
          srcWasBurned: true,
          dstWasMinted: true,
        }),
      ]

      const configs: InteropAggregationConfig[] = [
        {
          id: 'config1',
          plugins: [{ plugin: 'across', bridgeType: 'lockAndMint' }],
          type: 'other',
        },
        {
          id: 'config2',
          plugins: [{ plugin: 'stargate', bridgeType: 'burnAndMint' }],
          type: 'other',
        },
      ]

      const classifier = new InteropTransferClassifier()
      const service = new InteropAggregationService(classifier)

      const result = service.aggregate(transfers, configs, to)

      expect(result.aggregatedTransfers).toHaveLength(2)
      expect(result.aggregatedTransfers[0].id).toEqual('config1')
      expect(result.aggregatedTransfers[1].id).toEqual('config2')

      expect(result.aggregatedTokensPairs).toHaveLength(2)
      expect(result.aggregatedTokensPairs[0].id).toEqual('config1')
      expect(result.aggregatedTokensPairs[1].id).toEqual('config2')
    })

    it('returns empty arrays when no transfers match', () => {
      const transfers: InteropTransferRecord[] = []

      const configs: InteropAggregationConfig[] = [
        {
          id: 'config1',
          plugins: [{ plugin: 'across', bridgeType: 'lockAndMint' }],
          type: 'other',
        },
      ]

      const classifier = new InteropTransferClassifier()
      const service = new InteropAggregationService(classifier)

      const result = service.aggregate(transfers, configs, to)

      expect(result.aggregatedTransfers).toEqual([])
      expect(result.aggregatedTokens).toEqual([])
      expect(result.aggregatedTokensPairs).toEqual([])
    })

    it('aggregates one-sided transfers even when their bridge type cannot be inferred', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer('across', 'msg1', 'deposit', to - UnixTime.HOUR, {
          srcChain: 'ethereum',
          dstChain: 'solana',
          srcAbstractTokenId: 'usdc',
          dstAbstractTokenId: 'usdc',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: undefined,
          srcWasBurned: false,
          dstWasMinted: undefined,
          srcEventId: 'src-only-event',
          dstEventId: undefined,
        }),
      ]

      const configs: InteropAggregationConfig[] = [
        {
          id: 'config1',
          plugins: [{ plugin: 'across', bridgeType: 'lockAndMint' }],
          type: 'other',
        },
      ]

      const classifier = new InteropTransferClassifier()
      const service = new InteropAggregationService(classifier)

      const result = service.aggregate(transfers, configs, to)

      expect(result.aggregatedTransfers).toHaveLength(1)
      expect(result.aggregatedTransfers[0]?.bridgeType).toEqual('unknown')
      expect(result.aggregatedTransfers[0]?.transferCount).toEqual(1)
      expect(result.aggregatedTokens).toHaveLength(1)
      expect(result.aggregatedTokensPairs).toHaveLength(1)
    })

    it('does not aggregate one-sided transfers when they carry a mismatched bridge type', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer('across', 'msg1', 'deposit', to - UnixTime.HOUR, {
          bridgeType: 'nonMinting',
          srcChain: 'ethereum',
          dstChain: 'solana',
          srcAbstractTokenId: 'usdc',
          dstAbstractTokenId: 'usdc',
          duration: 5000,
          srcValueUsd: 2000,
          dstValueUsd: undefined,
          srcWasBurned: false,
          dstWasMinted: undefined,
          srcEventId: 'src-only-event',
          dstEventId: undefined,
        }),
      ]

      const configs: InteropAggregationConfig[] = [
        {
          id: 'config1',
          plugins: [{ plugin: 'across', bridgeType: 'lockAndMint' }],
          type: 'other',
        },
      ]

      const classifier = new InteropTransferClassifier()
      const service = new InteropAggregationService(classifier)

      const result = service.aggregate(transfers, configs, to)

      expect(result.aggregatedTransfers).toEqual([])
      expect(result.aggregatedTokens).toEqual([])
      expect(result.aggregatedTokensPairs).toEqual([])
    })
  })
})

const to = 1768484645

function createTransfer(
  plugin: string,
  transferId: string,
  type: string,
  timestamp: UnixTime,
  overrides: {
    bridgeType?: 'lockAndMint' | 'burnAndMint' | 'nonMinting'
    srcChain: string
    dstChain: string
    srcAbstractTokenId: string
    dstAbstractTokenId: string
    duration: number
    srcValueUsd?: number
    dstValueUsd?: number
    srcWasBurned?: boolean
    dstWasMinted?: boolean
    srcEventId?: string
    dstEventId?: string
  },
): InteropTransferRecord {
  return {
    plugin,
    transferId,
    type,
    bridgeType: overrides.bridgeType,
    timestamp,
    srcTime: timestamp,
    srcTxHash: 'random-hash',
    srcLogIndex: 0,
    // We need to preserve explicit undefined here for one-sided transfer tests.
    // Using ?? would replace it with the fallback and accidentally make the
    // transfer two-sided again.
    srcEventId:
      'srcEventId' in overrides ? overrides.srcEventId : 'random-event-id',
    srcTokenAddress: undefined,
    srcRawAmount: undefined,
    srcWasBurned: overrides.srcWasBurned,
    srcSymbol: undefined,
    srcAmount: undefined,
    srcPrice: undefined,
    dstTime: timestamp + overrides.duration,
    dstTxHash: 'random-hash',
    dstLogIndex: 0,
    dstEventId:
      'dstEventId' in overrides ? overrides.dstEventId : 'random-event-id',
    dstTokenAddress: undefined,
    dstRawAmount: undefined,
    dstWasMinted: overrides.dstWasMinted,
    dstSymbol: undefined,
    dstAmount: undefined,
    dstPrice: undefined,
    isProcessed: false,
    srcChain: overrides.srcChain,
    dstChain: overrides.dstChain,
    srcAbstractTokenId: overrides.srcAbstractTokenId,
    dstAbstractTokenId: overrides.dstAbstractTokenId,
    duration: overrides.duration,
    srcValueUsd: overrides.srcValueUsd,
    dstValueUsd: overrides.dstValueUsd,
  }
}
