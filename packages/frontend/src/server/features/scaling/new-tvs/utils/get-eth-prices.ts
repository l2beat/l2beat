import { createPriceId } from '@l2beat/backend-shared'
import { AssetId, CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'

const ethPriceId = createPriceId({
  type: 'coingecko',
  coingeckoId: CoingeckoId('ethereum'),
  assetId: AssetId.ETH,
  address: 'native',
  chain: 'ethereum',
  sinceTimestamp: 0,
})

export async function getEthPrices() {
  const db = getDb()
  const prices = await db.price.getByConfigIdsInRange(
    [ethPriceId],
    0,
    UnixTime.now(),
  )
  return prices.reduce<Record<number, number>>((acc, curr) => {
    acc[curr.timestamp] = curr.priceUsd
    return acc
  }, {})
}
