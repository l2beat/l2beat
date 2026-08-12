import { v } from '@l2beat/validate'
import {
  getTokenGraphTilesPage,
  TokenTilesParams,
} from '~/server/features/tokens/getTokenGraphTilesPage'
import { getTokenRelationsGraphById } from '~/server/features/tokens/getTokenRelationsGraphById'
import { procedure, router } from '../trpc'

export const tokensRouter = router({
  tiles: procedure
    .input(TokenTilesParams)
    .query(({ input }) => getTokenGraphTilesPage(input)),
  relationsGraph: procedure
    .input(v.object({ tokenId: v.string() }))
    .query(({ input }) => getTokenRelationsGraphById(input.tokenId)),
})
