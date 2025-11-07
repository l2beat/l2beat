import type { TokenDatabase } from '@l2beat/database'
import { v } from '@l2beat/validate'
import fuzzysort from 'fuzzysort'
import { db } from '../../database/db'
import { readOnlyProcedure, router } from '../trpc'

export interface SearchRouterDeps {
  db: TokenDatabase
}

export function createSearchRouter(deps: SearchRouterDeps) {
  const { db } = deps

  return router({
    tokens: readOnlyProcedure.input(v.string()).query(async ({ input }) => {
      const deployedTokens = await db.deployedToken.getAll()
      if (input.startsWith('0x')) {
        return {
          deployedTokens: deployedTokens.filter((t) => t.address === input),
          abstractTokens: [],
        }
      }

      const abstractTokens = await db.abstractToken.getAll()

      const abstractResult = fuzzysort.go(input, abstractTokens, {
        limit: 15,
        keys: [
          (e) => e.id,
          (e) => e.symbol,
          (e) => e.category,
          (e) => e.coingeckoId ?? '',
          (e) => e.issuer ?? 'unknown',
        ],
      })

      const deployedResult = fuzzysort.go(input, deployedTokens, {
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
}

export const searchRouter = createSearchRouter({
  db,
})
