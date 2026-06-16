import { INTEROP_CHAINS } from '@l2beat/config'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'

type Dependencies = {
  getExplorerUrl: (chain: string) => string | undefined
  chains: readonly { id: string; type: 'evm' }[]
  oneSidedChains: readonly string[]
}

export function createChainsRouter(deps: Dependencies) {
  return router({
    metadata: protectedProcedure.query(() => {
      return INTEROP_CHAINS.map((chain) => ({
        id: chain.id,
        display: chain.display,
        explorerUrl: deps.getExplorerUrl(chain.id),
      }))
    }),
    summary: protectedProcedure.query(() => {
      const captureChains = new Set(deps.chains.map((chain) => chain.id))
      const oneSidedChains = new Set(deps.oneSidedChains)

      return INTEROP_CHAINS.map((chain) => ({
        id: chain.id,
        name: chain.name,
        display: chain.display,
        color: chain.color,
        iconSlug: chain.iconSlug ?? chain.id,
        enabledOnCapture: captureChains.has(chain.id),
        enabledOnOneSided: oneSidedChains.has(chain.id),
      }))
    }),
  })
}
