import { writeFileSync } from 'fs'
import path from 'path'
import { layer2ToBackendProject } from '@l2beat/backend-shared'
import { Logger, getEnv } from '@l2beat/backend-tools'
import { layer2s } from '@l2beat/config'
import {
  BlockProvider,
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
  RpcClient,
} from '@l2beat/shared'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { LocalExecutor } from './modules/tvs/LocalExecutor'
import { mapConfig } from './modules/tvs/mapConfig'
import { BalanceProvider } from './modules/tvs/providers/BalanceProvider'
import { CirculatingSupplyProvider } from './modules/tvs/providers/CirculatingSupplyProvider'
import { PriceProvider } from './modules/tvs/providers/PriceProvider'
import { TotalSupplyProvider } from './modules/tvs/providers/TotalSupplyProvider'

main().catch((e: unknown) => {
  console.error(e)
})

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
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
  const priceProvider = new PriceProvider(coingeckoQueryService)
  const circulatingSupplyProvider = new CirculatingSupplyProvider(
    coingeckoQueryService,
  )

  const chains = ['ethereum', 'arbitrum']
  const rpcs = new Map<string, RpcClient>()
  const blockProviders = new Map<string, BlockProvider>()

  for (const chain of chains) {
    const url = env.string(`${chain.toUpperCase()}_RPC_URL`)
    const rpc = new RpcClient({
      url,
      http,
      logger,
      retryStrategy: 'RELIABLE',
      sourceName: chain,
      callsPerMinute: 120,
    })
    rpcs.set(chain, rpc)
    blockProviders.set(chain, new BlockProvider(chain, [rpc]))
  }

  const totalSupplyProvider = new TotalSupplyProvider(rpcs)
  const balanceProvider = new BalanceProvider(rpcs)

  const localExecutor = new LocalExecutor(
    priceProvider,
    circulatingSupplyProvider,
    blockProviders,
    totalSupplyProvider,
    balanceProvider,
    logger,
  )

  const arbitrum = layer2s.find((l) => l.id === ProjectId('arbitrum'))
  assert(arbitrum, 'Arbitrum not found')
  assert(arbitrum.chainConfig, 'Arbitrum chain config not defined')
  const backendProject = layer2ToBackendProject(arbitrum)

  const config = mapConfig(backendProject, arbitrum.chainConfig)

  const timestamp = new UnixTime(1737723600) //UnixTime.now().toStartOf('hour')
  const tvs = await localExecutor.run(config, [timestamp])

  const tokens = tvs.get(timestamp.toNumber())
  assert(tokens, 'No data for timestamp')

  let total = 0
  let canonical = 0
  let external = 0
  let native = 0

  const tokenBreakdown: {
    ticker: string
    source: string
    amount: number
    value: number
  }[] = []

  for (const token of tokens) {
    const tokenConfig = config.tokens.find((t) => t.id === token.tokenId)
    assert(tokenConfig, `Token config not found ${token.tokenId}`)

    total += token.valueForTotal

    tokenBreakdown.push({
      ticker: tokenConfig.ticker,
      source: tokenConfig.source,
      amount: token.amount,
      value: token.value,
    })

    switch (tokenConfig.source) {
      case 'canonical':
        canonical += token.value
        break
      case 'external':
        external += token.value
        break
      case 'native':
        native += token.value
        break
      default:
        throw new Error(`Unknown source ${tokenConfig.source}`)
    }
  }

  logger.info(`Total: $${toBillionsString(total)}B`)
  logger.info(`Canonical: $${toBillionsString(canonical)}B`)
  logger.info(`External: $${toBillionsString(external)}B`)
  logger.info(`Native: $${toBillionsString(native)}B`)

  // dump token breakdown to file
  writeFileSync(
    path.join(__dirname, 'token-breakdown.json'),
    JSON.stringify(tokenBreakdown, null, 2),
  )
}

function toBillionsString(value: number) {
  return (value / 1e9).toFixed(2)
}
