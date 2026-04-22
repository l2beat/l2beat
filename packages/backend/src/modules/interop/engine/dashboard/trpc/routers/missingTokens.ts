import type { TokenDbClient } from '@l2beat/token-backend'
import { v } from '@l2beat/validate'
import {
  dedupeMissingTokens,
  getMissingTokenKey,
  getMissingTokenStatuses,
  getMissingTokens,
  type MissingTokenDbStatus,
} from '../../impls/missingTokens'
import { protectedProcedure } from '../procedures'
import { router } from '../trpc'

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
    list: protectedProcedure.query(({ ctx }) => getMissingTokens(ctx.db, deps)),
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
          outcomes: tokens.map((token) => {
            const status = statuses.get(`${token.chain}:${token.tokenAddress}`)
            const outcome = status
              ? statusToOutcome[status]
              : statusToOutcome.unsupported

            return {
              ...token,
              outcome,
            }
          }),
        }
      }),
  })
}

const statusToOutcome = {
  ready: 'requested',
  missing: 'skipped_missing',
  incomplete: 'skipped_incomplete',
  unsupported: 'skipped_unsupported',
} satisfies Record<MissingTokenDbStatus, string>
