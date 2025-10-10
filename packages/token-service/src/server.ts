import * as trpcExpress from '@trpc/server/adapters/express'
import { config as dotenv } from 'dotenv'
import express from 'express'
import { db } from './database/db'
import { appRouter } from './trpc/appRouter'

dotenv()

function main() {
  const app = express()
  app.use(express.json())

  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext: ({ req }) => ({
        headers: new Headers(req.headers as Record<string, string>),
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
