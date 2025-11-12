import { v } from '@l2beat/validate'
import fuzzysort from 'fuzzysort'
import { readOnlyProcedure } from '../procedures'
import { router } from '../trpc'

export const searchRouter = router({
  tokens: readOnlyProcedure.input(v.string()).query(async ({ ctx, input }) => {
    const deployedTokens = await ctx.db.deployedToken.getAll()
    if (input.startsWith('0x')) {
      return {
        deployedTokens: deployedTokens.filter(
          (t) => t.address.toLowerCase() === input.toLowerCase(),
        ),
        abstractTokens: [],
      }
    }

    const abstractTokens = await ctx.db.abstractToken.getAll()

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
