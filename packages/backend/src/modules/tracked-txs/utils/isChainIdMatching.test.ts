import type { TrackedTxSharedBridgeConfig } from '@l2beat/shared'
import { expect, mockObject } from 'earl'
import {
  agglayerSharedBridgeChainId,
  agglayerSharedBridgeVerifyBatchesInput,
  agglayerSharedBridgeVerifyBatchesSignature,
  elasticChainSharedBridgeChainId,
  elasticChainSharedBridgeCommitBatchesInput,
  elasticChainSharedBridgeCommitBatchesSignature,
  elasticChainSharedBridgeExecuteBatchesInput,
  elasticChainSharedBridgeExecuteBatchesSignature,
  elasticChainSharedBridgeProveBatchesInput,
  elasticChainSharedBridgeProveBatchesSignature,
} from '../../../test/sharedBridge'
import { isChainIdMatching } from './isChainIdMatching'

describe(isChainIdMatching.name, () => {
  describe('Elastic Chain Shared Bridge', () => {
    it('commitBatches', () => {
      const mockSharedBridgeConfig = mockObject<TrackedTxSharedBridgeConfig>({
        chainId: elasticChainSharedBridgeChainId,
        signature: elasticChainSharedBridgeCommitBatchesSignature,
      })

      const result = isChainIdMatching(
        elasticChainSharedBridgeCommitBatchesInput,
        mockSharedBridgeConfig,
      )

      expect(result).toEqual(true)
    })

    it('proveBatches', () => {
      const mockSharedBridgeConfig = mockObject<TrackedTxSharedBridgeConfig>({
        chainId: elasticChainSharedBridgeChainId,
        signature: elasticChainSharedBridgeProveBatchesSignature,
      })

      const result = isChainIdMatching(
        elasticChainSharedBridgeProveBatchesInput,
        mockSharedBridgeConfig,
      )

      expect(result).toEqual(true)
    })

    it('executeBatches', () => {
      const mockSharedBridgeConfig = mockObject<TrackedTxSharedBridgeConfig>({
        chainId: elasticChainSharedBridgeChainId,
        signature: elasticChainSharedBridgeExecuteBatchesSignature,
      })

      const result = isChainIdMatching(
        elasticChainSharedBridgeExecuteBatchesInput,
        mockSharedBridgeConfig,
      )

      expect(result).toEqual(true)
    })
  })

  describe('Agglayer Shared Bridge', () => {
    it('verifyBatchesTrustedAggregator', () => {
      const mockSharedBridgeConfig = mockObject<TrackedTxSharedBridgeConfig>({
        chainId: agglayerSharedBridgeChainId,
        signature: agglayerSharedBridgeVerifyBatchesSignature,
      })

      const result = isChainIdMatching(
        agglayerSharedBridgeVerifyBatchesInput,
        mockSharedBridgeConfig,
      )

      expect(result).toEqual(true)
    })
  })
})
