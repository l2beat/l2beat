import { UnixTime } from '@l2beat/shared-pure'
import type { CoingeckoClient } from '../../../chains/clients/coingecko/CoingeckoClient'
import type { Coin } from '../../../chains/clients/coingecko/types'

export async function checkAbstractToken(
  coingeckoClient: CoingeckoClient,
  coingeckoId: string,
) {
  let coin: Coin | null = null
  try {
    coin = await coingeckoClient.getCoinDataById(coingeckoId)
  } catch (error) {
    console.error(error)
  }

  if (coin === null) {
    return {
      error: {
        type: 'not-found-on-coingecko' as const,
        message: 'Coin not found on Coingecko',
      },
      data: undefined,
    }
  }

  let listingTimestamp: UnixTime | undefined
  try {
    const marketChart = await coingeckoClient.getCoinMarketChartRange(
      coin.id,
      'usd',
      UnixTime.fromDate(new Date('2000-01-01')),
      UnixTime.fromDate(new Date()),
    )
    const [firstPrice] = marketChart.prices

    if (firstPrice) {
      listingTimestamp = UnixTime(Math.floor(firstPrice.date.getTime() / 1000))
    }
  } catch (error) {
    console.error(error)
  }

  return {
    error: undefined,
    data: {
      id: coin.id,
      iconUrl: coin.image.large,
      symbol: coin.symbol,
      listingTimestamp,
    },
  }
}
