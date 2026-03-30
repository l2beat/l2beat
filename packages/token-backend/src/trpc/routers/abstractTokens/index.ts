import { v } from '@l2beat/validate'
import type { CoingeckoClient } from '../../../chains/clients/coingecko/CoingeckoClient'
import { readOnlyProcedure } from '../../procedures'
import { router } from '../../trpc'
import { checkAbstractToken } from './checkAbstractToken'
import { getAllWithDeployedTokens } from './getAllWithDeployedTokens'

export interface AbstractTokensRouterDeps {
  coingeckoClient: CoingeckoClient
}

export const abstractTokensRouter = (deps: AbstractTokensRouterDeps) => {
  const { coingeckoClient } = deps

  return router({
    getAll: readOnlyProcedure.query(({ ctx }) => {
      return ctx.tokenDb.abstractToken.getAll()
    }),
    getAllWithDeployedTokens: readOnlyProcedure.query(({ ctx }) =>
      getAllWithDeployedTokens(ctx.tokenDb),
    ),
    getById: readOnlyProcedure
      .input(v.string())
      .query(async ({ ctx, input }) => {
        const abstractToken = await ctx.tokenDb.abstractToken.findById(input)
        if (!abstractToken) {
          return null
        }
        const deployedTokens =
          await ctx.tokenDb.deployedToken.getByAbstractTokenId(input)
        return {
          ...abstractToken,
          deployedTokens,
        }
      }),
    checks: readOnlyProcedure
      .input(v.string())
      .query(({ input }) => checkAbstractToken(coingeckoClient, input)),
  })
}
