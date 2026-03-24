import { assertUnreachable } from '@l2beat/shared-pure'
import type { TRPCError } from '@trpc/server'
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
        const logFn = getLogFn(opts.error)
        logFn(opts.error.message, {
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

function getLogFn(error: TRPCError) {
  switch (error.code) {
    case 'UNAUTHORIZED':
    case 'BAD_REQUEST':
      return logger.warn
    case 'PARSE_ERROR':
    case 'INTERNAL_SERVER_ERROR':
    case 'NOT_IMPLEMENTED':
    case 'BAD_GATEWAY':
    case 'SERVICE_UNAVAILABLE':
    case 'GATEWAY_TIMEOUT':
    case 'FORBIDDEN':
    case 'NOT_FOUND':
    case 'METHOD_NOT_SUPPORTED':
    case 'TIMEOUT':
    case 'CONFLICT':
    case 'PRECONDITION_FAILED':
    case 'PAYLOAD_TOO_LARGE':
    case 'UNSUPPORTED_MEDIA_TYPE':
    case 'UNPROCESSABLE_CONTENT':
    case 'TOO_MANY_REQUESTS':
    case 'CLIENT_CLOSED_REQUEST':
      return logger.error
    default:
      assertUnreachable(error.code)
  }
}
