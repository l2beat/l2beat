import { config as dotenv } from 'dotenv'
import express from 'express'
import { CoingeckoClient } from './chains/clients/coingecko/CoingeckoClient'
import { getConfig } from './config'
import { getDb, getTokenDb } from './database/db'
import { TokenIngestionLoop } from './ingestion/TokenIngestionLoop'
import { TokenIngestionProcessor } from './ingestion/TokenIngestionProcessor'
import { getLogger } from './logger'
import { createTrpcRouter } from './server/routers/TrpcRouter'

dotenv()

function main() {
  const app = express()
  const config = getConfig()
  const tokenDb = getTokenDb(config)
  const db = getDb(config)
  const logger = getLogger()

  app.use(express.json({ limit: `${config.jsonBodyLimitMb}mb` }))

  const coingeckoClient = new CoingeckoClient({
    apiKey: config.coingeckoApiKey,
  })

  const newQueueState = config.tokenIngestion.autoApprove ? 'pending' : 'staged'
  const tokenIngestionProcessor = new TokenIngestionProcessor({
    db,
    tokenDb,
    coingeckoClient,
    etherscanApiKey: config.etherscanApiKey,
    newQueueState,
  })

  app.get('/health', (_, res) => {
    res.status(200).send('OK')
  })

  app.use(
    '/trpc',
    createTrpcRouter({
      config,
      db,
      tokenDb,
      coingeckoClient,
      etherscanApiKey: config.etherscanApiKey,
      tokenIngestionProcessor,
    }),
  )

  const tokenIngestionLoop = config.tokenIngestion.enabled
    ? new TokenIngestionLoop(db, tokenDb, tokenIngestionProcessor, logger, {
        intervalMs: config.tokenIngestion.intervalMs,
        newQueueState,
        maxProcessedPerRun: config.tokenIngestion.maxProcessedPerRun,
      })
    : undefined
  tokenIngestionLoop?.start()

  const port = Number.parseInt(process.env['PORT'] ?? '3000', 10)
  const server = app.listen(port, () => {
    console.log(`Token service API listening on port ${port}`)
  })

  function shutdown(signal: NodeJS.Signals) {
    console.log(`Received ${signal}, shutting down...`)
    tokenIngestionLoop?.stop()
    server.close(() => {
      Promise.all([tokenDb.close(), db.close()])
        .then(() => {
          process.exit(0)
        })
        .catch((error: unknown) => {
          console.error('Error while closing database connection', error)
          process.exit(1)
        })
    })
  }
  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

main()
