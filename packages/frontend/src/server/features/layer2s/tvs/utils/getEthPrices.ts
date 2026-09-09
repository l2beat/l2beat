import { UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'

export async function getEthPrices() {
  const db = getDb()
  const prices = await db.tvsPrice.getPricesInRangeByPriceId(
    'ethereum',
    null,
    UnixTime.toStartOf(UnixTime.now(), 'hour'),
  )
  return prices.reduce<Record<number, number>>((acc, curr) => {
    acc[curr.timestamp] = curr.priceUsd
    return acc
  }, {})
}
