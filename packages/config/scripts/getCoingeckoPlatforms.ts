import { getEnv, Logger } from '@l2beat/backend-tools'
import { CoingeckoClient, HttpClient } from '@l2beat/shared'
import { ScriptLogger } from '../src/tokens/utils/ScriptLogger'

async function main() {
  const logger = new ScriptLogger({})
  const env = getEnv()
  const coingeckoApiKey = env.optionalString('COINGECKO_API_KEY')
  const http = new HttpClient()

  const coingeckoClient = new CoingeckoClient({
    apiKey: coingeckoApiKey,
    http,
    retryStrategy: 'SCRIPT',
    callsPerMinute: coingeckoApiKey ? 400 : 10,
    sourceName: 'coingeckoAPI',
    logger: Logger.SILENT,
  })

  logger.fetching('coin list from Coingecko')
  const coinList = await coingeckoClient.getCoinList({
    includePlatform: true,
  })

  const res = new Set<string>()

  for (const [_, coin] of Object.entries(coinList)) {
    for (const platform of Object.keys(coin.platforms)) {
      res.add(platform)
    }
  }

  logger.success('\nSupported platforms:')

  for (const platform of Array.from(res).sort()) {
    logger.log(platform)
  }
}

main().catch((e: unknown) => {
  console.error(e)
})
