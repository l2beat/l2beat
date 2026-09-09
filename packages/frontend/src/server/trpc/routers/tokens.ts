import { v } from '@l2beat/validate'
import { getCachedInteropTokenRelationsGraphById } from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraphById'
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
        (await getCachedInteropTokenRelationsGraphById(input.tokenId)) ?? null,
    ),
})
