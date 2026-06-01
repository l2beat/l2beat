import type { TokenDbClient } from '@l2beat/token-backend'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import { getInteropHighlights } from '../../impls/highlights'

interface HighlightsRouterDeps {
  tokenDbClient: TokenDbClient
  chains: readonly { id: string }[]
}

export function createHighlightsRouter(deps: HighlightsRouterDeps) {
  const interopProjectIds = deps.chains.map((chain) => chain.id)

  return router({
    latest: protectedProcedure.query(({ ctx }) => {
      return getInteropHighlights(ctx.db, deps.tokenDbClient, interopProjectIds)
    }),
  })
}
