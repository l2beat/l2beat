import * as trpcExpress from '@trpc/server/adapters/express'
import express from 'express'
import { appRouter } from './trpc/appRouter'
import { createContext } from './trpc/trpc'

function main() {
  const app = express()

  app.get('/health', (_, res) => {
    res.status(200).send('OK')
  })

  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  )

  const port = Number.parseInt(process.env['PORT'] ?? '3000', 10)
  app.listen(port, () => {
    console.log(`Token Knowledge API listening on port ${port}`)
  })
}

main()
