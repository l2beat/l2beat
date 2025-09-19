import {
  type Env,
  getEnv,
  LogFormatterEcs,
  LogFormatterJson,
  LogFormatterPretty,
  Logger,
  type LoggerOptions,
  type LoggerTransportOptions,
} from '@l2beat/backend-tools'
import { createDatabase } from '@l2beat/database'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
  PriceProvider,
} from '@l2beat/shared'
import { parentPort, workerData } from 'worker_threads'
import type { DatabaseConfig } from '../../config/Config'
import {
  ElasticSearchTransport,
  type ElasticSearchTransportOptions,
} from '../../peripherals/elastic-search/ElasticSearchTransport'
import { BridgeMatcher } from './BridgeMatcher'
import { FinancialsService } from './financials/FinancialsService'
import { INTEROP_TOKENS } from './financials/tokens'
import { createBridgePlugins } from './plugins'

function runMatcher(workerData: {
  dbConfig: DatabaseConfig
  supportedChains: string[]
}) {
  const env = getEnv()
  const logger = createLogger(env)
  const db = createDatabase({
    ...workerData.dbConfig.connection,
    ...workerData.dbConfig.connectionPoolSize,
  })
  const http = new HttpClient()
  const coingeckoClient = new CoingeckoClient({
    apiKey: env.string('COINGECKO_API_KEY'),
    retryStrategy: 'RELIABLE',
    logger,
    callsPerMinute: 100,
    http,
    sourceName: 'coingecko-matcher',
  })
  const priceProvider = new PriceProvider(
    new CoingeckoQueryService(coingeckoClient, logger),
  )
  const financialsService = new FinancialsService(INTEROP_TOKENS, priceProvider)

  const plugins = createBridgePlugins()

  const matcher = new BridgeMatcher(
    financialsService,
    db,
    plugins,
    workerData.supportedChains,
    logger,
  )

  matcher.start()
}

const result = runMatcher(workerData)
parentPort?.postMessage(result)

function createLogger(env: Env): Logger {
  const isLocal = env.optionalString('DEPLOYMENT_ENV') === undefined

  const loggerTransports: LoggerTransportOptions[] = [
    {
      transport: console,
      formatter: isLocal ? new LogFormatterPretty() : new LogFormatterJson(),
    },
  ]

  // Elastic Search logging
  const esEnabled = env.optionalBoolean('ES_ENABLED') ?? false

  if (esEnabled) {
    console.log('Elastic Search logging enabled')
    const options: ElasticSearchTransportOptions = {
      node: env.string('ES_NODE'),
      apiKey: env.string('ES_API_KEY'),
      indexPrefix: env.string('ES_INDEX_PREFIX'),
      flushInterval: env.optionalInteger('ES_FLUSH_INTERVAL'),
    }

    loggerTransports.push({
      transport: new ElasticSearchTransport(options),
      formatter: new LogFormatterEcs(),
    })
  }

  const options: Partial<LoggerOptions> = {
    logLevel: env.string('LOG_LEVEL', 'INFO') as LoggerOptions['logLevel'],
    utc: isLocal ? false : true,
    transports: loggerTransports,
    metricsEnabled: env.boolean('CLIENT_METRICS_ENABLED', esEnabled),
  }

  return new Logger(options)
}
