import { assert } from '@l2beat/shared-pure'
import type { FlowsGraphNode } from '../types'

export function getChainColor(
  interopChains: FlowsGraphNode[],
  chainId: string,
): string {
  const chain = interopChains.find((c) => c.id === chainId)
  assert(chain, `Chain ${chainId} not found`)
  return chain.color
}
