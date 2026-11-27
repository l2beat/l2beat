import type {
  AbstractTokenRecord,
  DeployedTokenPrimaryKey,
  DeployedTokenRecord,
  TokenRelationRoute,
} from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { getTokenDb } from '~/server/tokenDb'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'

export interface KnownToken {
  deployedToken: DeployedTokenRecord
  abstractToken: AbstractTokenRecord | undefined
}

/** Everything a report reads besides the chain. */
export interface InsightDataSource {
  /**
   * Every deployment token-db has on the chain, ignored ones included, by
   * lowercase address. Shared between reports, so never mutated.
   */
  getDeployedTokens(chain: string): Promise<ReadonlyMap<string, KnownToken>>
  getRoutesForTokens(
    tokens: DeployedTokenPrimaryKey[],
  ): Promise<TokenRelationRoute[]>
  /** USD price per CoinGecko id; an id without a recent price is missing. */
  getPrices(
    coingeckoIds: string[],
    timestamp: UnixTime,
  ): Promise<Map<string, number>>
}

// Prices are written hourly; three hours tolerates two missed runs and
// leaves a token unpriced rather than valued at a day-old price.
export const PRICE_AGE_MAX = 3 * UnixTime.HOUR

// Token-db changes through edits and token ingestion, not every block, so a
// report may miss a change for up to ten minutes: a new token counts as
// untracked and an ignored or repriced one keeps its old flags. Balances are
// always read live. One key per chain, and Insight reads one chain, so the
// cache holds one entry (about 3,900 rows).
const DEPLOYED_TOKENS_TTL = 5 * UnixTime.MINUTE
const DEPLOYED_TOKENS_STALE_WHILE_REVALIDATE = 5 * UnixTime.MINUTE
const deployedTokensCache = new FrontendInMemoryCache('insightDeployedTokens')

export function createDatabaseDataSource(): InsightDataSource {
  return {
    getDeployedTokens: (chain) =>
      deployedTokensCache.get(
        {
          key: ['insight-deployed-tokens', chain],
          ttl: DEPLOYED_TOKENS_TTL,
          staleWhileRevalidate: DEPLOYED_TOKENS_STALE_WHILE_REVALIDATE,
        },
        async () =>
          indexByAddress(
            await getTokenDb().deployedToken.getByChainWithAbstractTokens(
              chain,
            ),
          ),
      ),
    getRoutesForTokens: (tokens) =>
      getTokenDb().tokenRelation.getRoutesForTokens(tokens),
    getPrices: async (coingeckoIds, timestamp) => {
      const prices =
        await getDb().interopRecentPrices.getClosestPricesAtOrBefore(
          coingeckoIds.map((coingeckoId, requestId) => ({
            requestId,
            coingeckoId,
            timestamp,
          })),
          PRICE_AGE_MAX,
        )
      const result = new Map<string, number>()
      for (const [requestId, priceUsd] of prices) {
        const coingeckoId = coingeckoIds[requestId]
        if (coingeckoId !== undefined && priceUsd !== undefined) {
          result.set(coingeckoId, priceUsd)
        }
      }
      return result
    },
  }
}

function indexByAddress(tokens: KnownToken[]): Map<string, KnownToken> {
  const byAddress = new Map<string, KnownToken>()
  for (const token of tokens) {
    const { address } = token.deployedToken
    assert(address === address.toLowerCase(), 'Token-db stores lowercase')
    assert(!byAddress.has(address), 'One deployment per chain and address')
    byAddress.set(address, token)
  }
  return byAddress
}
