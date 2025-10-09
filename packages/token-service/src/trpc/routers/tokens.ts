import { v } from '@l2beat/validate'
import fuzzysort from 'fuzzysort'
import { db } from '../../database/db'
import { protectedProcedure, router } from '../trpc'

export const tokensRouter = router({
  getAllAbstractTokens: protectedProcedure.query(() => {
    return db.abstractToken.getAll()
  }),
  search: protectedProcedure
    .input(v.object({ search: v.string() }))
    .query(async ({ input }) => {
      const deployedTokens = await db.deployedToken.getAll()
      if (input.search.startsWith('0x')) {
        return {
          deployedTokens: deployedTokens.filter(
            (t) => t.address === input.search,
          ),
          abstractTokens: [],
        }
      }

      const abstractTokens = await db.abstractToken.getAll()

      const abstractResult = fuzzysort.go(input.search, abstractTokens, {
        limit: 15,
        keys: [
          (e) => e.id,
          (e) => e.symbol,
          (e) => e.category,
          (e) => e.coingeckoId ?? '',
          (e) => e.issuer ?? 'unknown',
        ],
      })

      const deployedResult = fuzzysort.go(input.search, deployedTokens, {
        limit: 15,
        keys: [
          (e) => e.address,
          (e) => e.symbol,
          (e) => e.chain,
          (e) => e.abstractTokenId ?? '',
        ],
      })

      return {
        abstractTokens: abstractResult.map((match) => match.obj),
        deployedTokens: deployedResult.map((match) => match.obj),
      }
    }),
})
