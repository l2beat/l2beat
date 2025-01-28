import { expect, mockObject } from 'earl'

import type { TrackedTxSharedBridgeConfig } from '@l2beat/shared'
import {
  sharedBridgeChainId,
  sharedBridgeCommitBatchesInput,
  sharedBridgeCommitBatchesSignature,
  sharedBridgeExecuteBatchesInput,
  sharedBridgeExecuteBatchesSignature,
  sharedBridgeProveBatchesInput,
  sharedBridgeProveBatchesSignature,
} from '../../../test/sharedBridge'
import { isChainIdMatching } from './isChainIdMatching'

describe(isChainIdMatching.name, () => {
  it('commitBatches', () => {
    const mockSharedBridgeConfig = mockObject<TrackedTxSharedBridgeConfig>({
      chainId: sharedBridgeChainId,
      signature: sharedBridgeCommitBatchesSignature,
    })

    const result = isChainIdMatching(
      sharedBridgeCommitBatchesInput,
      mockSharedBridgeConfig,
    )

    expect(result).toEqual(true)
  })

  it('proveBatches', () => {
    const mockSharedBridgeConfig = mockObject<TrackedTxSharedBridgeConfig>({
      chainId: sharedBridgeChainId,
      signature: sharedBridgeProveBatchesSignature,
    })

    const result = isChainIdMatching(
      sharedBridgeProveBatchesInput,
      mockSharedBridgeConfig,
    )

    expect(result).toEqual(true)
  })

  it('executeBatches', () => {
    const mockSharedBridgeConfig = mockObject<TrackedTxSharedBridgeConfig>({
      chainId: sharedBridgeChainId,
      signature: sharedBridgeExecuteBatchesSignature,
    })

    const result = isChainIdMatching(
      sharedBridgeExecuteBatchesInput,
      mockSharedBridgeConfig,
    )

    expect(result).toEqual(true)
  })
})
