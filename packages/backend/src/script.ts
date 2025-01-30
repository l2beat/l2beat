import { writeFileSync } from 'fs'
import path from 'path'
import {
  type Env,
  LogFormatterPretty,
  type LogLevel,
  Logger,
  getEnv,
} from '@l2beat/backend-tools'
import {
  BlockProvider,
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
  RpcClient,
} from '@l2beat/shared'
import { assert, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { LocalExecutor } from './modules/tvs/LocalExecutor'
import { bobConfig } from './modules/tvs/projects/bob'
import { BalanceProvider } from './modules/tvs/providers/BalanceProvider'
import { CirculatingSupplyProvider } from './modules/tvs/providers/CirculatingSupplyProvider'
import { PriceProvider } from './modules/tvs/providers/PriceProvider'
import { RpcClientPOC } from './modules/tvs/providers/RpcClientPOC'
import { TotalSupplyProvider } from './modules/tvs/providers/TotalSupplyProvider'
import type {
  Token,
  TokenValue,
  TvsBreakdown,
  TvsConfig,
} from './modules/tvs/types'

main()
  .catch((e: unknown) => {
    console.error(e)
  })
  .finally(() => process.exit(0))

async function main() {
  const env = getEnv()
  const logger = initLogger(env)
  const localExecutor = initLocalExecutor(env, logger)

  const config = bobConfig

  const timestamp = UnixTime.now().toStartOf('hour').add(-3, 'hours')
  const tvs = await localExecutor.run(config, [timestamp], false)

  outputTVS(tvs, timestamp, config, logger)
}

function outputTVS(
  tvs: Map<number, TokenValue[]>,
  timestamp: UnixTime,
  config: TvsConfig,
  logger: Logger,
) {
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
    JSON.stringify(
      tokenBreakdown,
      (k, v) => {
        if (['value', 'valueForProject', 'valueForTotal'].includes(k)) {
          return `$${(v as number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }
        return v
      },
      2,
    ),
  )

  // dump filtered config to file
  writeFileSync(
    path.join(__dirname, 'token-config.json'),
    JSON.stringify(filteredConfig, null, 2),
  )
}

function initLocalExecutor(env: Env, logger: Logger) {
  const http = new HttpClient()

  const coingeckoQueryService = initCoingecko(env, logger, http)
  const { rpcs, blockProviders } = initChains(env, http, logger)

  const priceProvider = new PriceProvider(coingeckoQueryService)
  const circulatingSupplyProvider = new CirculatingSupplyProvider(
    coingeckoQueryService,
  )
  const totalSupplyProvider = new TotalSupplyProvider(rpcs)
  const balanceProvider = new BalanceProvider(rpcs)

  return new LocalExecutor(
    priceProvider,
    circulatingSupplyProvider,
    blockProviders,
    totalSupplyProvider,
    balanceProvider,
    logger,
  )
}

function initLogger(env: Env) {
  const logLevel = env.string('LOG_LEVEL', 'INFO') as LogLevel
  const logger = new Logger({
    logLevel: logLevel,
    transports: [
      {
        transport: console,
        formatter: new LogFormatterPretty(),
      },
    ],
  })
  return logger
}

function initCoingecko(env: Env, logger: Logger, http: HttpClient) {
  const coingeckoApiKey = env.optionalString('COINGECKO_API_KEY')
  const coingeckoClient = new CoingeckoClient({
    apiKey: coingeckoApiKey,
    retryStrategy: 'RELIABLE',
    logger,
    callsPerMinute: coingeckoApiKey ? 400 : 10,
    http,
    sourceName: 'coingecko',
  })
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
  return coingeckoQueryService
}

function initChains(env: Env, http: HttpClient, logger: Logger) {
  // https://www.multicall3.com/deployments
  const chains = [
    {
      name: 'ethereum',
      multicallV3: EthereumAddress(
        '0xcA11bde05977b3631167028862bE2a173976CA11',
      ),
      callsPerMinute: 12000,
    },
    {
      name: 'arbitrum',
      multicallV3: EthereumAddress(
        '0xcA11bde05977b3631167028862bE2a173976CA11',
      ),
      callsPerMinute: 12000,
    },
    {
      name: 'base',
      multicallV3: EthereumAddress(
        '0xcA11bde05977b3631167028862bE2a173976CA11',
      ),
      callsPerMinute: 12000,
    },
    {
      name: 'kinto',
      callsPerMinute: 1000,
      batchingEnabled: true,
    },
    {
      name: 'bob',
      multicallV3: EthereumAddress(
        '0xcA11bde05977b3631167028862bE2a173976CA11',
      ),
      callsPerMinute: 12000,
    },
  ]

  const rpcs = new Map<string, RpcClientPOC>()
  const blockProviders = new Map<string, BlockProvider>()

  for (const chain of chains) {
    const url = env.string(`${chain.name.toUpperCase()}_RPC_URL`)
    const rpc = new RpcClient({
      url,
      http,
      logger,
      retryStrategy: 'RELIABLE',
      sourceName: chain.name,
      callsPerMinute: chain.callsPerMinute,
    })
    rpcs.set(
      chain.name,
      new RpcClientPOC(rpc, chain.name, logger, {
        multicallV3: chain.multicallV3,
        batchingEnabled: chain.batchingEnabled,
      }),
    )
    blockProviders.set(chain.name, new BlockProvider(chain.name, [rpc]))
  }
  return { rpcs, blockProviders }
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
