import { createDatabase } from '@l2beat/database'
import * as trpcExpress from '@trpc/server/adapters/express'
import { config as dotenv } from 'dotenv'
import express from 'express'
import { appRouter } from './trpc/appRouter'
import { createContext } from './trpc/trpc'

dotenv()

function main() {
  const connectionString = process.env['DATABASE_URL']
  if (connectionString === undefined) {
    throw new Error('DATABASE_URL is required')
  }

  const db = createDatabase({
    connectionString,
    application_name: 'token-knowledge',
    min: 2,
    max: 10,
    ssl: !connectionString.includes('localhost')
      ? { rejectUnauthorized: false }
      : undefined,
  })

  const writeEnabled = process.env['TOKEN_KNOWLEDGE_WRITE_ENABLED'] === 'true'

  const app = express()

  app.get('/health', (_, res) => {
    res.status(200).send('OK')
  })

  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext: createContext(db, writeEnabled),
    }),
  )

  const port = Number.parseInt(process.env['PORT'] ?? '3007', 10)
  const server = app.listen(port)

  server.on('listening', () => {
    console.log(`Token Knowledge API listening on port ${port}`)
  })

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use.`)
      process.exit(1)
    }

    console.error('Unhandled server error:', err)
    process.exit(1)
  })

  function shutdown(signal: NodeJS.Signals) {
    console.log(`Received ${signal}, shutting down...`)
    server.close(() => {
      db.close().finally(() => {
        process.exit(0)
      })
    })
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

main()
