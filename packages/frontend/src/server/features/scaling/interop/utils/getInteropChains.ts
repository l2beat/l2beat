import { INTEROP_CHAINS, type InteropChain } from '@l2beat/config'
import { env } from '~/env'

export function getInteropChains(): InteropChain[] {
  const enabledChainIds = env.INTEROP_ENABLED_CHAINS
  if (!enabledChainIds || enabledChainIds.length === 0) {
    return INTEROP_CHAINS
  }

  const enabledSet = new Set(enabledChainIds)
  return INTEROP_CHAINS.filter((chain) => enabledSet.has(chain.id))
}
