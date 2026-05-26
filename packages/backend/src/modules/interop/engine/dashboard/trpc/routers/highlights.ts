import { INTEROP_CHAINS } from '@l2beat/config'
import type { TokenDbClient } from '@l2beat/token-backend'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import { getInteropHighlights } from '../../impls/highlights'

interface HighlightsRouterDeps {
  tokenDbClient: TokenDbClient
}

const interopProjectIds = INTEROP_CHAINS.map((chain) => chain.id)

export function createHighlightsRouter(deps: HighlightsRouterDeps) {
  return router({
    latest: protectedProcedure.query(({ ctx }) => {
      return getInteropHighlights(ctx.db, deps.tokenDbClient, interopProjectIds)
    }),
  })
}
