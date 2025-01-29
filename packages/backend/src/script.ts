import { writeFileSync } from 'fs'
import path from 'path'
import { Logger, getEnv } from '@l2beat/backend-tools'
import {
  BlockProvider,
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
  RpcClient,
} from '@l2beat/shared'
import { assert, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { LocalExecutor } from './modules/tvs/LocalExecutor'
import { arbitrumConfig } from './modules/tvs/projects/arbitrum'
import { BalanceProvider } from './modules/tvs/providers/BalanceProvider'
import { CirculatingSupplyProvider } from './modules/tvs/providers/CirculatingSupplyProvider'
import { PriceProvider } from './modules/tvs/providers/PriceProvider'
import { RpcClientPOC } from './modules/tvs/providers/RpcClientPOC'
import { TotalSupplyProvider } from './modules/tvs/providers/TotalSupplyProvider'
import type { Token, TokenValue, TvsBreakdown } from './modules/tvs/types'

main()
  .catch((e: unknown) => {
    console.error(e)
  })
  .finally(() => process.exit(0))

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
  const rpcs = new Map<string, RpcClientPOC>()
  const blockProviders = new Map<string, BlockProvider>()

  for (const chain of chains) {
    const url = env.string(`${chain.toUpperCase()}_RPC_URL`)
    const rpc = new RpcClient({
      url,
      http,
      logger,
      retryStrategy: 'RELIABLE',
      sourceName: chain,
      callsPerMinute: 12000,
    })
    rpcs.set(
      chain,
      new RpcClientPOC(rpc, logger, {
        multicallV3: EthereumAddress(
          '0xcA11bde05977b3631167028862bE2a173976CA11',
        ),
      }),
    )
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

  const config = arbitrumConfig

  // const timestamp = new UnixTime(1738047600) //UnixTime.now().toStartOf('hour')
  const timestamp = UnixTime.now()
  const tvs = await localExecutor.run(config, [timestamp], true)

  const tokens = tvs.get(timestamp.toNumber())
  assert(tokens, 'No data for timestamp')

  const tvsBreakdown: TvsBreakdown = {
    total: 0,
    source: {
      canonical: 0,
      external: 0,
      native: 0,
    },
    category: {
      ether: 0,
      stablecoin: 0,
      other: 0,
    },
  }

  const tokenBreakdown: (TokenValue & {
    ticker: string
    source: string
    category: string
  })[] = []

  const filteredConfig: Token[] = []

  for (const token of tokens) {
    const tokenConfig = config.tokens.find((t) => t.id === token.tokenId)
    assert(tokenConfig, `Token config not found ${token.tokenId}`)

    tvsBreakdown.total += token.valueForProject

    if (token.amount !== 0) {
      filteredConfig.push(tokenConfig)

      tokenBreakdown.push({
        ...token,
        ticker: tokenConfig.ticker,
        source: tokenConfig.source,
        category: tokenConfig.category,
      })
    }

    switch (tokenConfig.source) {
      case 'canonical':
        tvsBreakdown.source.canonical += token.valueForProject
        break
      case 'external':
        tvsBreakdown.source.external += token.valueForProject
        break
      case 'native':
        tvsBreakdown.source.native += token.valueForProject
        break
      default:
        throw new Error(`Unknown source ${tokenConfig.source}`)
    }

    switch (tokenConfig.category) {
      case 'ether':
        tvsBreakdown.category.ether += token.valueForProject
        break
      case 'stablecoin':
        tvsBreakdown.category.stablecoin += token.valueForProject
        break
      case 'other':
        tvsBreakdown.category.other += token.valueForProject
        break
      default:
        throw new Error(`Unknown source ${tokenConfig.source}`)
    }
  }

  // output TVS breakdown
  logger.info(
    JSON.stringify(
      tvsBreakdown,
      (_, v) => {
        if (typeof v === 'number') {
          return toDollarString(v)
        }
        return v
      },
      2,
    ),
  )

  // dump individualTokens to file
  writeFileSync(
    path.join(__dirname, 'token-breakdown.json'),
    JSON.stringify(tokenBreakdown, null, 2),
  )

  // dump filtered config to file
  writeFileSync(
    path.join(__dirname, 'token-config.json'),
    JSON.stringify(filteredConfig, null, 2),
  )
}

function toDollarString(value: number) {
  if (value > 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (value > 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  } else {
    return `$${value.toFixed(2)}`
  }
}
