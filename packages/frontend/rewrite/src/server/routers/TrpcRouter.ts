import * as trpcExpress from '@trpc/server/adapters/express'
import express from 'express'
import { appRouter } from 'rewrite/src/server/api/root'

const createContext = ({ req }: trpcExpress.CreateExpressContextOptions) => ({
  headers: new Headers(req.headers as Record<string, string>),
})

export function createTrpcRouter() {
  const router = express.Router()

  router.use(
    '/',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  )

  return router
}
