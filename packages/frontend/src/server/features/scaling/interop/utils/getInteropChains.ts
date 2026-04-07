import { INTEROP_CHAINS, type InteropChain } from '@l2beat/config'
import { env } from '~/env'

interface InteropChainWithUpcoming extends InteropChain {
  isUpcoming: boolean
}

export function getInteropChains(): InteropChainWithUpcoming[] {
  const disabledSet = new Set(env.INTEROP_DISABLED_CHAINS)
  const upcomingSet = new Set(env.INTEROP_UPCOMING_CHAINS)

  return INTEROP_CHAINS.filter((chain) => !disabledSet.has(chain.id)).map(
    (chain) => ({
      ...chain,
      isUpcoming: upcomingSet.has(chain.id),
    }),
  )
}
