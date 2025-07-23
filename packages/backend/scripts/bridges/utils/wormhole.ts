import type { EthereumAddress } from '@l2beat/shared-pure'

export function createWormholeSequence(
  emitterChainId: number,
  emitterAddress: EthereumAddress,
  sequence: bigint,
) {
  return `${emitterChainId}_${emitterAddress}_${sequence}`
}
