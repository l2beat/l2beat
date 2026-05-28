import type { AbstractTokenRecord } from '@l2beat/database'
import { unique } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getTokenDb } from '~/server/tokenDb'
import { getLatestAggregatedInteropTransferWithTokens } from '../utils/getLatestAggregatedInteropTransferWithTokens'

export type InteropAbstractToken = Pick<
  AbstractTokenRecord,
  'id' | 'symbol' | 'issuer' | 'iconUrl' | 'category'
>

export async function getInteropAbstractTokens(
  chainIds: string[],
): Promise<InteropAbstractToken[]> {
  if (env.MOCK) {
    return MOCK_INTEROP_ABSTRACT_TOKENS
  }

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
