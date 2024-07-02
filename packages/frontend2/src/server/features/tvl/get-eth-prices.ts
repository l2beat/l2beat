import { createPriceId } from '@l2beat/backend/src/modules/tvl/utils/createPriceId'
import { AssetId, CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { db } from '~/server/database'

const ethPriceId = createPriceId({
  type: 'coingecko',
  coingeckoId: CoingeckoId('ethereum'),
  assetId: AssetId.ETH,
  address: 'native',
  chain: 'ethereum',
  sinceTimestamp: UnixTime.ZERO,
})

export async function getEthPrices() {
  const prices = await db.price.getByConfigId(ethPriceId)
  return prices.reduce<Record<number, number>>((acc, curr) => {
    acc[curr.timestamp.toNumber()] = curr.priceUsd
    return acc
  }, {})
}
