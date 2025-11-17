import * as trpcExpress from '@trpc/server/adapters/express'
import { config as dotenv } from 'dotenv'
import express from 'express'
import { CoingeckoClient } from './chains/clients/coingecko/CoingeckoClient'
import { getConfig } from './config'
import { getDb } from './database/db'
import { createAppRouter } from './trpc/appRouter'
import { createTRPCContext } from './trpc/trpc'

dotenv()

function main() {
  const app = express()
  const config = getConfig()
  const db = getDb(config)

  app.use(express.json())

  const coingeckoClient = new CoingeckoClient({
    apiKey: config.coingeckoApiKey,
  })

  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: createAppRouter({
        coingeckoClient,
        etherscanApiKey: config.etherscanApiKey,
      }),
      allowMethodOverride: true, // Allow POST for GET queries due to large payload
      createContext: ({ req }) =>
        createTRPCContext({
          headers: new Headers(req.headers as Record<string, string>),
          config,
          db,
        }),
    }),
  )

  const port = Number.parseInt(process.env['PORT'] ?? '3000', 10)
  const server = app.listen(port, () => {
    console.log(`Token service API listening on port ${port}`)
  })

  function shutdown(signal: NodeJS.Signals) {
    console.log(`Received ${signal}, shutting down...`)
    server.close(() => {
      db.close()
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
