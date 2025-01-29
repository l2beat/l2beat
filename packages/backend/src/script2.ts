import { Logger, getEnv } from '@l2beat/backend-tools'
import { tokenList } from '@l2beat/config'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
} from '@l2beat/shared'
import { PriceProvider } from './modules/tvs/providers/PriceProvider'
import { tokenToTicker } from './modules/tvs/providers/tickers'

async function main() {
  const env = getEnv()
  const http = new HttpClient()
  const coingeckoApiKey = env.optionalString('COINGECKO_API_KEY')
  const logger = Logger.INFO

  const coingeckoClient = new CoingeckoClient({
    apiKey: coingeckoApiKey,
    retryStrategy: 'RELIABLE',
    logger,
    callsPerMinute: coingeckoApiKey ? 400 : 10,
    http,
    sourceName: 'coingecko',
  })
  const coingeckoQueryService = new CoingeckoQueryService(
    coingeckoClient,
    logger,
  )
  const priceProvider = new PriceProvider(coingeckoQueryService)

  const ids = [...new Set(tokenList.map((t) => tokenToTicker(t))).values()]

  console.log(`Fetching latest price for ${ids.length}`)
  console.time('TIME')
  const prices = await priceProvider.getLatestPrices(ids)
  console.timeEnd('TIME')
  console.log(prices.get('ETH'))
  console.log(prices.get('USDC'))
  console.log(prices.get('UNI'))
  console.log(prices.size)
}

main().catch((e: unknown) => {
  console.error(e)
})
