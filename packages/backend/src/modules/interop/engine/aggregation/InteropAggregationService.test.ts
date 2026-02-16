import type { InteropTransferRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { InteropAggregationConfig } from '../../../../config/features/interop'
import { InteropAggregationService } from './InteropAggregationService'
import { InteropTransferClassifier } from './InteropTransferClassifier'

describe(InteropAggregationService.name, () => {
  describe(InteropAggregationService.prototype.aggregate.name, () => {
    it('aggregates transfers and tokens correctly', () => {
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
        transferCount: 2,
        totalDurationSum: 11000,
        srcValueUsd: 5000,
        dstValueUsd: 5000,
        avgValueInFlight: undefined,
        countUnder100: 0,
        count100To1K: 0,
        count1KTo10K: 2,
        count10KTo100K: 0,
        countOver100K: 0,
        identifiedCount: 2,
        mintedValueUsd: 5000,
        burnedValueUsd: 0,
        bridgeType: 'lockAndMint',
      })

      expect(result.aggregatedTokens).toHaveLength(1)
      expect(result.aggregatedTokens[0]).toEqual({
        timestamp: to,
        id: 'config1',
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        abstractTokenId: 'eth',
        transferCount: 2,
        totalDurationSum: 11000,
        volume: 5000,
        bridgeType: 'lockAndMint',
        mintedValueUsd: 5000,
        burnedValueUsd: 0,
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
        },
        {
          id: 'config2',
          plugins: [{ plugin: 'stargate', bridgeType: 'burnAndMint' }],
        },
      ]

      const classifier = new InteropTransferClassifier()
      const service = new InteropAggregationService(classifier)

      const result = service.aggregate(transfers, configs, to)

      expect(result.aggregatedTransfers).toHaveLength(2)
      expect(result.aggregatedTransfers[0].id).toEqual('config1')
      expect(result.aggregatedTransfers[1].id).toEqual('config2')
    })

    it('returns empty arrays when no transfers match', () => {
      const transfers: InteropTransferRecord[] = []

      const configs: InteropAggregationConfig[] = [
        {
          id: 'config1',
          plugins: [{ plugin: 'across', bridgeType: 'lockAndMint' }],
        },
      ]

      const classifier = new InteropTransferClassifier()
      const service = new InteropAggregationService(classifier)

      const result = service.aggregate(transfers, configs, to)

      expect(result.aggregatedTransfers).toEqual([])
      expect(result.aggregatedTokens).toEqual([])
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
    srcChain: string
    dstChain: string
    srcAbstractTokenId: string
    dstAbstractTokenId: string
    duration: number
    srcValueUsd?: number
    dstValueUsd?: number
    srcWasBurned?: boolean
    dstWasMinted?: boolean
  },
): InteropTransferRecord {
  return {
    plugin,
    transferId,
    type,
    bridgeType: undefined,
    timestamp,
    srcTime: timestamp,
    srcTxHash: 'random-hash',
    srcLogIndex: 0,
    srcEventId: 'random-event-id',
    srcTokenAddress: undefined,
    srcRawAmount: undefined,
    srcWasBurned: overrides.srcWasBurned,
    srcSymbol: undefined,
    srcAmount: undefined,
    srcPrice: undefined,
    dstTime: timestamp + overrides.duration,
    dstTxHash: 'random-hash',
    dstLogIndex: 0,
    dstEventId: 'random-event-id',
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
