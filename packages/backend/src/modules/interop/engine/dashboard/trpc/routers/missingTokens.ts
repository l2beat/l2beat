import type { TokenDbClient } from '@l2beat/token-backend'
import { v } from '@l2beat/validate'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import {
  dedupeMissingTokens,
  getMissingTokenKey,
  getMissingTokenStatuses,
  getMissingTokens,
} from '../../impls/missingTokens'
import {
  InteropTransferDataRangeRequest,
  resolveInteropTransferTimeRange,
} from '../transferDataRange'

type Dependencies = {
  chains: readonly { id: string; type: 'evm' }[]
  tokenDbClient: TokenDbClient
}

const MissingTokenSelection = v.object({
  chain: v.string(),
  tokenAddress: v.string(),
})

export function createMissingTokensRouter(deps: Dependencies) {
  return router({
    list: protectedProcedure
      .input(InteropTransferDataRangeRequest)
      .query(async ({ ctx, input }) =>
        getMissingTokens(
          ctx.db,
          deps,
          await resolveInteropTransferTimeRange(ctx.db, input.range),
        ),
      ),
    requeue: protectedProcedure
      .input(v.array(MissingTokenSelection))
      .mutation(async ({ ctx, input }) => {
        const tokens = dedupeMissingTokens(input)
        const statuses = await getMissingTokenStatuses(tokens, deps)
        const readyTokens = tokens.filter(
          (token) => statuses.get(getMissingTokenKey(token)) === 'ready',
        )

        const updatedTransfers =
          readyTokens.length > 0
            ? await ctx.db.interopTransfer.markAsUnprocessedByTokens(
                readyTokens,
              )
            : 0

        return {
          updatedTransfers,
          requestedTokenCount: readyTokens.length,
          skippedTokenCount: tokens.length - readyTokens.length,
        }
      }),
  })
}
