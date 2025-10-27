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
import { isFistParameterMatching } from './isFirstParameterMatching'

describe(isFistParameterMatching.name, () => {
  describe('Elastic Chain Shared Bridge', () => {
    it('commitBatches', () => {
      const mockSharedBridgeConfig = mockObject<TrackedTxSharedBridgeConfig>({
        firstParameter: elasticChainSharedBridgeChainId,
        signature: elasticChainSharedBridgeCommitBatchesSignature,
      })

      const result = isFistParameterMatching(
        elasticChainSharedBridgeCommitBatchesInput,
        mockSharedBridgeConfig,
      )

      expect(result).toEqual(true)
    })

    it('proveBatches', () => {
      const mockSharedBridgeConfig = mockObject<TrackedTxSharedBridgeConfig>({
        firstParameter: elasticChainSharedBridgeChainId,
        signature: elasticChainSharedBridgeProveBatchesSignature,
      })

      const result = isFistParameterMatching(
        elasticChainSharedBridgeProveBatchesInput,
        mockSharedBridgeConfig,
      )

      expect(result).toEqual(true)
    })

    it('executeBatches', () => {
      const mockSharedBridgeConfig = mockObject<TrackedTxSharedBridgeConfig>({
        firstParameter: elasticChainSharedBridgeChainId,
        signature: elasticChainSharedBridgeExecuteBatchesSignature,
      })

      const result = isFistParameterMatching(
        elasticChainSharedBridgeExecuteBatchesInput,
        mockSharedBridgeConfig,
      )

      expect(result).toEqual(true)
    })
  })

  describe('Agglayer Shared Bridge', () => {
    it('verifyBatchesTrustedAggregator', () => {
      const mockSharedBridgeConfig = mockObject<TrackedTxSharedBridgeConfig>({
        firstParameter: agglayerSharedBridgeChainId,
        signature: agglayerSharedBridgeVerifyBatchesSignature,
      })

      const result = isFistParameterMatching(
        agglayerSharedBridgeVerifyBatchesInput,
        mockSharedBridgeConfig,
      )

      expect(result).toEqual(true)
    })
  })
})
