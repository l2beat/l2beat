import * as trpcExpress from '@trpc/server/adapters/express'
import express from 'express'
import { appRouter } from '~/server/trpc/root'
import { getRequestId } from '../middlewares/RequestIdMiddleware'
import { getRequestIp } from '../utils/getRequestIp'
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
        logger.warn(opts.error.message, {
          requestId: getRequestId(opts.req),
          ip: getRequestIp(opts.req),
          method: opts.req.method,
          url: opts.req.originalUrl,
          referer: opts.req.headers.referer ?? 'unknown',
          userAgent: opts.req.headers['user-agent'] ?? 'unknown',
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
