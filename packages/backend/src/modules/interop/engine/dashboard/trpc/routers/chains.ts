import { INTEROP_CHAINS } from '@l2beat/config'
import { publicProcedure } from '../procedures'
import { router } from '../trpc'

type Dependencies = {
  getExplorerUrl: (chain: string) => string | undefined
}

export function createChainsRouter(deps: Dependencies) {
  return router({
    metadata: publicProcedure.query(() => {
      return INTEROP_CHAINS.map((chain) => ({
        id: chain.id,
        display: chain.display,
        explorerUrl: deps.getExplorerUrl(chain.id),
      }))
    }),
  })
}
