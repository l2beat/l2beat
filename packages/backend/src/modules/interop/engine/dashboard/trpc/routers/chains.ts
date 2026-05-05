import { INTEROP_CHAINS } from '@l2beat/config'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'

type Dependencies = {
  getExplorerUrl: (chain: string) => string | undefined
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
  })
}
