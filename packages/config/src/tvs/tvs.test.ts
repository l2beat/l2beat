import { TokenId, notUndefined } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { groupBy } from 'lodash'
import { getProjects } from '../processing/getProjects'
import { getTokenList } from '../tokens/tokens'

describe('tvs', () => {
  const projects = getProjects().filter((p) => p.tvsConfig)

  it('every token has a unique id within project', () => {
    for (const project of projects) {
      const tokenIds = new Set<string>()
      for (const token of project.tvsConfig!) {
        expect(tokenIds.has(token.id)).toEqual(false)
        tokenIds.add(token.id)
      }
    }
  })

  it('tokens with the same symbol are properly handled', () => {
    const tokens = getTokenList(
      getProjects()
        .map((p) => p.chainConfig)
        .filter(notUndefined),
    )

    const bySymbol = groupBy(tokens, 'symbol')

    for (const [symbol, tokens] of Object.entries(bySymbol)) {
      const coingeckoIds = new Set(tokens.map((t) => t.coingeckoId))

      if (coingeckoIds.size > 1) {
        // If this test fails go to TokenId.ts and add symbol to SYMBOL_DUPLICATES.
        // This is a known issue where we have tokens with the same symbol.
        // In some of the cases they are the same e.g. USDC, in some not e.g. GAME.
        // In case of symbols clash we just add priceId as suffix to TokenId.
        expect(TokenId.SYMBOL_DUPLICATES).toInclude(symbol)
      }
    }
  })
})
