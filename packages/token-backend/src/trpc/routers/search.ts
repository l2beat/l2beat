import { v } from '@l2beat/validate'
import fuzzysort from 'fuzzysort'
import { readOnlyProcedure } from '../procedures'
import { router } from '../trpc'

export const searchRouter = router({
  all: readOnlyProcedure.input(v.string()).query(async ({ ctx, input }) => {
    const deployedTokens = await ctx.db.deployedToken.getAll()
    const abstractTokens = await ctx.db.abstractToken.getAll()
    const chains = await ctx.db.chain.getAll()

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

    const chainResult = fuzzysort.go(input, chains, {
      limit: 15,
      keys: [
        (e) => e.name,
        (e) => e.chainId.toString(),
        (e) => e.explorerUrl ?? '',
        (e) => (e.aliases ?? []).join(' '),
      ],
    })

    return {
      abstractTokens: abstractResult.map((match) => match.obj),
      deployedTokens: deployedResult.map((match) => match.obj),
      chains: chainResult.map((match) => match.obj),
    }
  }),
})
