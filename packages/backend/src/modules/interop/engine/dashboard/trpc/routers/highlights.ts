import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import { getInteropHighlights } from '../../impls/highlights'

export function createHighlightsRouter() {
  return router({
    latest: protectedProcedure.query(({ ctx }) => {
      return getInteropHighlights(ctx.db)
    }),
  })
}
