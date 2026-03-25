import type { Database, TokenDatabase } from '@l2beat/database'
import { assertUnreachable } from '@l2beat/shared-pure'
import type { TRPCError } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import express from 'express'
import type { CoingeckoClient } from '../../chains/clients/coingecko/CoingeckoClient'
import type { Config } from '../../config/Config'
import { getLogger } from '../../logger'
import { createAppRouter } from '../../trpc/appRouter'
import { createTRPCContext } from '../../trpc/trpc'

const logger = getLogger().for('TrpcRouter')

export interface CreateTrpcRouterDeps {
  config: Config
  db: Database
  tokenDb: TokenDatabase
  coingeckoClient: CoingeckoClient
  etherscanApiKey: string | undefined
}

export function createTrpcRouter(deps: CreateTrpcRouterDeps): express.Router {
  const { config, db, tokenDb, coingeckoClient, etherscanApiKey } = deps

  const router = express.Router()

  router.use(
    '/',
    trpcExpress.createExpressMiddleware({
      router: createAppRouter({
        coingeckoClient,
        etherscanApiKey,
      }),
      allowMethodOverride: true, // Allow POST for GET queries due to large payload
      createContext: ({ req }) =>
        createTRPCContext({
          headers: new Headers(req.headers as Record<string, string>),
          config,
          db,
          tokenDb,
        }),
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
