import type { TokenDatabase } from '@l2beat/database'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import { getInteropHighlights } from '../../impls/highlights'

interface HighlightsRouterDeps {
  tokenDb: TokenDatabase
}

export function createHighlightsRouter(deps: HighlightsRouterDeps) {
  return router({
    latest: protectedProcedure.query(({ ctx }) => {
      return getInteropHighlights(ctx.db, deps.tokenDb)
    }),
  })
}
