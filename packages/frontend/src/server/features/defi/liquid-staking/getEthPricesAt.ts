import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getLatestAtOrBefore } from './getEthStakedAt'

const MOCK_ETH_PRICE = 3_000
/**
 * TVS keeps ETH's price hourly, then six-hourly, then daily, while DeFiLlama
 * TVL stays hourly, so an older hour takes the price that TVS kept before it.
 */
const MAX_PRICE_AGE = UnixTime.DAY

/** ETH's USD price at each timestamp, as TVS valued ETH then; null when missing. */
export async function getEthPricesAt(
  timestamps: number[],
): Promise<(number | null)[]> {
  if (timestamps.length === 0) return []
  if (env.MOCK) return timestamps.map(() => MOCK_ETH_PRICE)

  const prices = await getDb().tvsPrice.getPricesInRangeByPriceId(
    'ethereum',
    UnixTime(Math.min(...timestamps) - MAX_PRICE_AGE),
    UnixTime(Math.max(...timestamps)),
  )
  return getLatestAtOrBefore(
    timestamps,
    prices.map((price) => ({
      timestamp: price.timestamp,
      value: price.priceUsd,
    })),
    MAX_PRICE_AGE,
  )
}
