import type { TrackedTxSharedBridgeConfig } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
import { describe, expect, it } from 'vitest'
import {
  agglayerSharedBridgeChainId,
  agglayerSharedBridgeVerifyBatchesInput,
  agglayerSharedBridgeVerifyBatchesSignature,
  elasticChainSharedBridgeChainId,
  elasticChainSharedBridgeCommitBatchesInput,
  elasticChainSharedBridgeCommitBatchesSignature,
  elasticChainSharedBridgeExecuteBatchesInput,
  elasticChainSharedBridgeExecuteBatchesPost29Input,
  elasticChainSharedBridgeExecuteBatchesPost29Signature,
  elasticChainSharedBridgeExecuteBatchesSignature,
  elasticChainSharedBridgeProveBatchesInput,
  elasticChainSharedBridgeProveBatchesSignature,
  gatewaySharedBridgeChainAddress,
} from '../../../test/sharedBridge'
import { isFistParameterMatching } from './isFirstParameterMatching'

describe(isFistParameterMatching.name, () => {
  describe('Elastic Chain Shared Bridge', () => {
    it('commitBatches', () => {
      const mockSharedBridgeConfig = {
        firstParameter: elasticChainSharedBridgeChainId,
        signature: elasticChainSharedBridgeCommitBatchesSignature,
      } as unknown as TrackedTxSharedBridgeConfig

      const result = isFistParameterMatching(
        elasticChainSharedBridgeCommitBatchesInput,
        mockSharedBridgeConfig,
      )

      expect(result).toEqual(true)
    })

    it('proveBatches', () => {
      const mockSharedBridgeConfig = {
        firstParameter: elasticChainSharedBridgeChainId,
        signature: elasticChainSharedBridgeProveBatchesSignature,
      } as unknown as TrackedTxSharedBridgeConfig

      const result = isFistParameterMatching(
        elasticChainSharedBridgeProveBatchesInput,
        mockSharedBridgeConfig,
      )

      expect(result).toEqual(true)
    })

    it('executeBatches', () => {
      const mockSharedBridgeConfig = {
        firstParameter: elasticChainSharedBridgeChainId,
        signature: elasticChainSharedBridgeExecuteBatchesSignature,
      } as unknown as TrackedTxSharedBridgeConfig

      const result = isFistParameterMatching(
        elasticChainSharedBridgeExecuteBatchesInput,
        mockSharedBridgeConfig,
      )

      expect(result).toEqual(true)
    })
  })

  describe('Agglayer Shared Bridge', () => {
    it('verifyBatchesTrustedAggregator', () => {
      const mockSharedBridgeConfig = {
        firstParameter: agglayerSharedBridgeChainId,
        signature: agglayerSharedBridgeVerifyBatchesSignature,
      } as unknown as TrackedTxSharedBridgeConfig

      const result = isFistParameterMatching(
        agglayerSharedBridgeVerifyBatchesInput,
        mockSharedBridgeConfig,
      )

      expect(result).toEqual(true)
    })
  })

  describe('Elastic Chain Shared Bridge (post v29)', () => {
    it('executeBatches with correct chainAddress', () => {
      const mockSharedBridgeConfig = {
        firstParameter: EthereumAddress(gatewaySharedBridgeChainAddress),
        signature: elasticChainSharedBridgeExecuteBatchesPost29Signature,
      } as unknown as TrackedTxSharedBridgeConfig

      const result = isFistParameterMatching(
        elasticChainSharedBridgeExecuteBatchesPost29Input,
        mockSharedBridgeConfig,
      )

      expect(result).toEqual(true)
    })

    it('executeBatches with incorrect chainAddress', () => {
      const mockSharedBridgeConfig = {
        firstParameter: EthereumAddress.random(),
        signature: elasticChainSharedBridgeExecuteBatchesPost29Signature,
      } as unknown as TrackedTxSharedBridgeConfig

      const result = isFistParameterMatching(
        elasticChainSharedBridgeExecuteBatchesPost29Input,
        mockSharedBridgeConfig,
      )

      expect(result).toEqual(false)
    })
  })
})
