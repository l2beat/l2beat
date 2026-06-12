import type { AbstractTokenRecord } from '@l2beat/database'
import { InMemoryCache, unique } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getTokenDb } from '~/server/tokenDb'
import { getInteropChains } from '../utils/getInteropChains'
import { getLatestAggregatedInteropTransferWithTokens } from '../utils/getLatestAggregatedInteropTransferWithTokens'

export type InteropAbstractToken = Pick<
  AbstractTokenRecord,
  'id' | 'symbol' | 'issuer' | 'iconUrl' | 'category'
>

const interopAbstractTokensCache = new InMemoryCache({})

export function getActiveInteropAbstractTokens(): Promise<
  InteropAbstractToken[]
> {
  const activeInteropChainIds = getInteropChains()
    .filter((chain) => !chain.isUpcoming)
    .map((chain) => chain.id)

  return getInteropAbstractTokens(activeInteropChainIds)
}

export async function getInteropAbstractTokens(
  chainIds: string[],
): Promise<InteropAbstractToken[]> {
  if (env.MOCK) {
    return MOCK_INTEROP_ABSTRACT_TOKENS
  }

  return await interopAbstractTokensCache.get(
    {
      key: ['interop-abstract-tokens', [...chainIds].sort().join(',')],
      ttl: 60 * 10,
      staleWhileRevalidate: 60 * 15,
    },
    () => getInteropAbstractTokensData(chainIds),
  )
}

async function getInteropAbstractTokensData(
  chainIds: string[],
): Promise<InteropAbstractToken[]> {
  const { records } = await getLatestAggregatedInteropTransferWithTokens({
    from: chainIds,
    to: chainIds,
  })
  const tokenIds = unique(
    records.flatMap((record) =>
      record.tokens.map((token) => token.abstractTokenId),
    ),
  )
  if (tokenIds.length === 0) return []

  return getTokenDb().abstractToken.getByIds(tokenIds)
}

const MOCK_INTEROP_ABSTRACT_TOKENS: InteropAbstractToken[] = [
  {
    id: 'eth001',
    symbol: 'ETH',
    issuer: 'ethereum',
    iconUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    category: 'ether',
  },
  {
    id: 'usdc01',
    symbol: 'USDC',
    issuer: 'circle',
    iconUrl:
      'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
    category: 'stablecoin',
  },
  {
    id: 'usdt01',
    symbol: 'USDT',
    issuer: 'tether',
    iconUrl:
      'https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663',
    category: 'stablecoin',
  },
]
