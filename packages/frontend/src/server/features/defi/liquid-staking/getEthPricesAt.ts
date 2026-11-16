import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'

const MOCK_ETH_PRICE = 3_000

/** ETH's USD price at each timestamp, as TVS valued ETH then; null when missing. */
export async function getEthPricesAt(
  timestamps: number[],
): Promise<(number | null)[]> {
  if (timestamps.length === 0) return []
  if (env.MOCK) return timestamps.map(() => MOCK_ETH_PRICE)

  const prices = await getDb().tvsPrice.getPricesInRangeByPriceId(
    'ethereum',
    UnixTime(Math.min(...timestamps)),
    UnixTime(Math.max(...timestamps)),
  )
  const byTimestamp = new Map(
    prices.map((price) => [price.timestamp, price.priceUsd]),
  )
  return timestamps.map((timestamp) => byTimestamp.get(timestamp) ?? null)
}
