import type { InteropTransferRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { InteropAggregationConfig } from '../../../../config/features/interop'
import { InteropTransferClassifier } from './InteropTransferClassifier'

describe(InteropTransferClassifier.name, () => {
  const classifier = new InteropTransferClassifier()

  describe(InteropTransferClassifier.prototype.classifyTransfers.name, () => {
    it('matches and groups transfers with multiple plugins (OR logic)', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer('across', 'msg1', 'deposit', {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          srcWasBurned: false,
          dstWasMinted: true,
        }),
        createTransfer('stargate', 'msg2', 'deposit', {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          srcWasBurned: false,
          dstWasMinted: false,
        }),
        createTransfer('cctp-v1', 'msg3', 'deposit', {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'usdc',
          dstAbstractTokenId: 'usdc',
          srcWasBurned: true,
          dstWasMinted: true,
        }),
      ]

      const config: InteropAggregationConfig = {
        id: 'config1',
        plugins: [{ plugin: 'across' }, { plugin: 'stargate' }],
      }

      const result = classifier.classifyTransfers(transfers, config)

      expect(result.lockAndMint).toHaveLength(1)
      expect(result.lockAndMint[0].transferId).toEqual('msg1')
      expect(result.nonMinting).toHaveLength(1)
      expect(result.nonMinting[0].transferId).toEqual('msg2')
      expect(result.omnichain).toHaveLength(0)
      expect(result.unknown).toHaveLength(0)
    })

    it('matches and groups transfers with all plugin conditions (AND logic within plugin)', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer('stargate', 'msg1', 'deposit', {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          srcWasBurned: false,
          dstWasMinted: true,
        }),
        createTransfer('stargate', 'msg2', 'deposit', {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'usdc',
          dstAbstractTokenId: 'usdc',
          srcWasBurned: false,
          dstWasMinted: true,
        }),
        createTransfer('stargate', 'msg3', 'deposit', {
          srcChain: 'polygon',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          srcWasBurned: false,
          dstWasMinted: true,
        }),
      ]

      const config: InteropAggregationConfig = {
        id: 'config1',
        plugins: [
          {
            plugin: 'stargate',
            chain: 'ethereum',
            abstractTokenId: 'eth',
          },
        ],
      }

      const result = classifier.classifyTransfers(transfers, config)

      expect(result.lockAndMint).toHaveLength(1)
      expect(result.lockAndMint[0].transferId).toEqual('msg1')
      expect(result.omnichain).toHaveLength(0)
      expect(result.nonMinting).toHaveLength(0)
      expect(result.unknown).toHaveLength(0)
    })

    it('groups all bridge types correctly', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer('across', 'msg1', 'deposit', {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          srcWasBurned: false,
          dstWasMinted: true,
        }),
        createTransfer('across', 'msg2', 'deposit', {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          srcWasBurned: true,
          dstWasMinted: true,
        }),
        createTransfer('across', 'msg3', 'deposit', {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          srcWasBurned: false,
          dstWasMinted: false,
        }),
        createTransfer('across', 'msg4', 'deposit', {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          srcWasBurned: true,
          dstWasMinted: false,
        }),
      ]

      const config: InteropAggregationConfig = {
        id: 'config1',
        plugins: [{ plugin: 'across' }],
      }

      const result = classifier.classifyTransfers(transfers, config)

      expect(result.lockAndMint).toHaveLength(1)
      expect(result.lockAndMint[0].transferId).toEqual('msg1')
      expect(result.omnichain).toHaveLength(1)
      expect(result.omnichain[0].transferId).toEqual('msg2')
      expect(result.nonMinting).toHaveLength(1)
      expect(result.nonMinting[0].transferId).toEqual('msg3')
      expect(result.unknown).toHaveLength(1)
      expect(result.unknown[0].transferId).toEqual('msg4')
    })

    it('returns empty arrays when no transfers match', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer('across', 'msg1', 'deposit', {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          srcWasBurned: false,
          dstWasMinted: true,
        }),
      ]

      const config: InteropAggregationConfig = {
        id: 'config1',
        plugins: [{ plugin: 'stargate' }],
      }

      const result = classifier.classifyTransfers(transfers, config)

      expect(result.lockAndMint).toEqual([])
      expect(result.omnichain).toEqual([])
      expect(result.nonMinting).toEqual([])
      expect(result.unknown).toEqual([])
    })

    it('returns empty arrays when given empty transfers', () => {
      const transfers: InteropTransferRecord[] = []

      const config: InteropAggregationConfig = {
        id: 'config1',
        plugins: [{ plugin: 'across' }],
      }

      const result = classifier.classifyTransfers(transfers, config)

      expect(result.lockAndMint).toEqual([])
      expect(result.omnichain).toEqual([])
      expect(result.nonMinting).toEqual([])
      expect(result.unknown).toEqual([])
    })
  })
})

function createTransfer(
  plugin: string,
  transferId: string,
  type: string,
  overrides: {
    srcChain: string
    dstChain: string
    srcAbstractTokenId: string
    dstAbstractTokenId: string
    srcWasBurned?: boolean
    dstWasMinted?: boolean
  },
): InteropTransferRecord {
  const timestamp = UnixTime.now()
  return {
    plugin,
    transferId,
    type,
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
    dstTime: timestamp,
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
    duration: 0,
    srcValueUsd: undefined,
    dstValueUsd: undefined,
  }
}
