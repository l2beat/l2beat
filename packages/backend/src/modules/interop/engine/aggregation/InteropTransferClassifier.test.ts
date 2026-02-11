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
      expect(result.burnAndMint).toHaveLength(0)
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
      expect(result.burnAndMint).toHaveLength(0)
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
        createTransfer('across', 'msg5', 'deposit', {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          srcWasBurned: undefined,
          dstWasMinted: undefined,
        }),
        createTransfer('across', 'msg6', 'deposit', {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          srcWasBurned: true,
          dstWasMinted: undefined,
        }),
        createTransfer('across', 'msg7', 'deposit', {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          srcWasBurned: undefined,
          dstWasMinted: true,
        }),
      ]

      const config: InteropAggregationConfig = {
        id: 'config1',
        plugins: [{ plugin: 'across' }],
      }

      const result = classifier.classifyTransfers(transfers, config)

      expect(result.lockAndMint).toHaveLength(2)
      expect(result.lockAndMint[0].transferId).toEqual('msg1')
      expect(result.lockAndMint[1].transferId).toEqual('msg4')
      expect(result.burnAndMint).toHaveLength(1)
      expect(result.burnAndMint[0].transferId).toEqual('msg2')
      expect(result.nonMinting).toHaveLength(1)
      expect(result.nonMinting[0].transferId).toEqual('msg3')
      expect(result.unknown).toHaveLength(3)
      expect(result.unknown[0].transferId).toEqual('msg5')
      expect(result.unknown[1].transferId).toEqual('msg6')
      expect(result.unknown[2].transferId).toEqual('msg7')
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
      expect(result.burnAndMint).toEqual([])
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
      expect(result.burnAndMint).toEqual([])
      expect(result.nonMinting).toEqual([])
      expect(result.unknown).toEqual([])
    })

    it('matches only transfers of specified bridgeType when plugin has bridgeType', () => {
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
          srcAbstractTokenId: 'usdc',
          dstAbstractTokenId: 'usdc',
          srcWasBurned: true,
          dstWasMinted: true,
        }),
      ]

      const config: InteropAggregationConfig = {
        id: 'config1',
        plugins: [{ plugin: 'across', bridgeType: 'burnAndMint' }],
      }

      const result = classifier.classifyTransfers(transfers, config)

      expect(result.lockAndMint).toHaveLength(0)
      expect(result.burnAndMint).toHaveLength(1)
      expect(result.burnAndMint[0].transferId).toEqual('msg2')
    })

    it('matches only transfers of specified transferType when plugin has transferType', () => {
      const transfers: InteropTransferRecord[] = [
        createTransfer('across', 'msg1', 'deposit', {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          srcWasBurned: false,
          dstWasMinted: true,
        }),
        createTransfer('across', 'msg2', 'withdrawal', {
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
        plugins: [{ plugin: 'across', transferType: 'withdrawal' }],
      }

      const result = classifier.classifyTransfers(transfers, config)

      expect(result.lockAndMint).toHaveLength(1)
      expect(result.lockAndMint[0].transferId).toEqual('msg2')
    })

    it('uses transfer bridgeType when set, otherwise infers from srcWasBurned/dstWasMinted', () => {
      // msg1: explicit bridgeType overrides burn/mint data for filter matching
      // msg2: no bridgeType → inferred lockAndMint from srcWasBurned=false, dstWasMinted=true
      // msg3: no bridgeType → inferred burnAndMint, does not match plugin's lockAndMint
      const transfers: InteropTransferRecord[] = [
        createTransfer('across', 'msg1', 'deposit', {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          srcWasBurned: true,
          dstWasMinted: true,
          bridgeType: 'lockAndMint',
        }),
        createTransfer('across', 'msg2', 'deposit', {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          srcWasBurned: false,
          dstWasMinted: true,
        }),
        createTransfer('across', 'msg3', 'deposit', {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          srcAbstractTokenId: 'eth',
          dstAbstractTokenId: 'eth',
          srcWasBurned: true,
          dstWasMinted: true,
        }),
      ]

      const config: InteropAggregationConfig = {
        id: 'config1',
        plugins: [{ plugin: 'across', bridgeType: 'lockAndMint' }],
      }

      const result = classifier.classifyTransfers(transfers, config)

      expect(result.lockAndMint).toHaveLength(1)
      expect(result.lockAndMint[0].transferId).toEqual('msg2')
      expect(result.burnAndMint).toHaveLength(1)
      expect(result.burnAndMint[0].transferId).toEqual('msg1')
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
    bridgeType?: 'lockAndMint' | 'burnAndMint' | 'nonMinting'
  },
): InteropTransferRecord {
  const timestamp = UnixTime.now()
  return {
    plugin,
    transferId,
    type,
    bridgeType: overrides.bridgeType,
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
