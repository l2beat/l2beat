import { getEnv } from '@l2beat/backend-tools'
import { createDatabase } from '@l2beat/database'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
  PriceProvider,
} from '@l2beat/shared'
import { parentPort, workerData } from 'worker_threads'
import { makeDatabaseConfig } from '../../config/makeConfig'
import { createLogger } from '../../tools/createLogger'
import { BridgeMatcher } from './BridgeMatcher'
import { FinancialsService } from './financials/FinancialsService'
import { INTEROP_TOKENS } from './financials/tokens'
import { createBridgePlugins } from './plugins'

function runMatchingWorker(workerData: {
  isLocal: boolean | undefined
  supportedChains: string[]
}) {
  const env = getEnv()
  const logger = createLogger(env)

  const dbConfig = makeDatabaseConfig(env, workerData.isLocal)
  const db = createDatabase({
    ...dbConfig.connection,
    ...dbConfig.connectionPoolSize,
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

function main() {
  try {
    const result = runMatchingWorker(workerData)
    parentPort?.postMessage(result)
  } catch (error) {
    parentPort?.postMessage({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
}

main()
