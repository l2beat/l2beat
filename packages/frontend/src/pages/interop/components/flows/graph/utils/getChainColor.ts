import { assert } from '@l2beat/shared-pure'
import type { InteropChainWithIcon } from '../../../chain-selector/types'

export function getChainColor(
  interopChains: InteropChainWithIcon[],
  chainId: string,
): string {
  const chain = interopChains.find((c) => c.id === chainId)
  assert(chain, `Chain ${chainId} not found`)
  return chain.color
}
