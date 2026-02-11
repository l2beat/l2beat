import { INTEROP_CHAINS, type InteropChain } from '@l2beat/config'
import { env } from '~/env'

export function getInteropChains(): InteropChain[] {
  const disabledChainIds = env.INTEROP_DISABLED_CHAINS
  if (!disabledChainIds || disabledChainIds.length === 0) {
    return INTEROP_CHAINS
  }

  const disabledSet = new Set(disabledChainIds)
  return INTEROP_CHAINS.filter((chain) => !disabledSet.has(chain.id))
}
