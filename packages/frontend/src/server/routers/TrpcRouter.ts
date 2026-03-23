import * as trpcExpress from '@trpc/server/adapters/express'
import express from 'express'
import { appRouter } from '~/server/trpc/root'
import { getLogger } from '../utils/logger'

const logger = getLogger().for('TrpcRouter')

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
      onError: (opts) => {
        logger.error(opts.error.message, {
          path: opts.path,
          stack: opts.error.stack,
          code: opts.error.code,
          type: opts.type,
          input: opts.input,
        })
      },
    }),
  )

  return router
}
