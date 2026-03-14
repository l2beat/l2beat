import type { InteropChainMetadata } from '../embeddings'
import { publicProcedure } from '../procedures'
import { router } from '../trpc'

type Dependencies = {
  getInteropChainMetadata: () => Promise<InteropChainMetadata[]>
}

export const createChainsRouter = (deps: Dependencies) =>
  router({
    metadata: publicProcedure.query(() => {
      return deps.getInteropChainMetadata()
    }),
  })
