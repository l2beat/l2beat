import { INTEROP_CHAINS } from '@l2beat/config'
import type { TokenDatabase } from '@l2beat/database'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import { getInteropHighlights } from '../../impls/highlights'

interface HighlightsRouterDeps {
  tokenDb: TokenDatabase
}

const interopProjectIds = INTEROP_CHAINS.map((chain) => chain.id)

export function createHighlightsRouter(deps: HighlightsRouterDeps) {
  return router({
    latest: protectedProcedure.query(({ ctx }) => {
      return getInteropHighlights(ctx.db, deps.tokenDb, interopProjectIds)
    }),
  })
}
