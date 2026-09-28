import { v } from '@l2beat/validate'
import { getTokenGraphs } from '~/server/features/tokens/getTokenGraphs'
import {
  getTokenGraphTilesPage,
  TokenGraphTilesParams,
} from '~/server/features/tokens/getTokenGraphTilesPage'
import { procedure, router } from '../trpc'

export const tokensRouter = router({
  tiles: procedure
    .input(TokenGraphTilesParams)
    .query(({ input }) => getTokenGraphTilesPage(input)),
  relationsGraph: procedure
    .input(v.object({ tokenId: v.string() }))
    .query(
      async ({ input }) =>
        (await getTokenGraphs()).graphs.get(input.tokenId) ?? null,
    ),
})
