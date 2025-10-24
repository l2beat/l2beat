import type { TrackedTxSharedBridgeConfig } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import {
  elasticChainSharedBridgeExecuteBatchesPost29Input,
  elasticChainSharedBridgeExecuteBatchesPost29Signature,
  gatewaySharedBridgeChainAddress,
} from '../../../test/sharedBridge'
import { isChainAddressMatching } from './isChainAddressMatching'

describe(isChainAddressMatching.name, () => {
  describe('Elastic Chain Shared Bridge (post v29)', () => {
    it('executeBatches with correct chainAddress', () => {
      const mockSharedBridgeConfig = mockObject<TrackedTxSharedBridgeConfig>({
        chainAddress: EthereumAddress(gatewaySharedBridgeChainAddress),
        signature: elasticChainSharedBridgeExecuteBatchesPost29Signature,
      })

      const result = isChainAddressMatching(
        elasticChainSharedBridgeExecuteBatchesPost29Input,
        mockSharedBridgeConfig,
      )

      expect(result).toEqual(true)
    })

    it('executeBatches with incorrect chainAddress', () => {
      const mockSharedBridgeConfig = mockObject<TrackedTxSharedBridgeConfig>({
        chainAddress: EthereumAddress.random(),
        signature: elasticChainSharedBridgeExecuteBatchesPost29Signature,
      })

      const result = isChainAddressMatching(
        elasticChainSharedBridgeExecuteBatchesPost29Input,
        mockSharedBridgeConfig,
      )

      expect(result).toEqual(false)
    })
  })
})
