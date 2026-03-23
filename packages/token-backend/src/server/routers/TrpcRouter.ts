import type { Database, TokenDatabase } from '@l2beat/database'
import * as trpcExpress from '@trpc/server/adapters/express'
import express from 'express'
import type { CoingeckoClient } from '../../chains/clients/coingecko/CoingeckoClient'
import type { Config } from '../../config/Config'
import { getLogger } from '../../logger'
import { createAppRouter } from '../../trpc/appRouter'
import { createTRPCContext } from '../../trpc/trpc'
import { logTrpcError } from './logTrpcError'

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
        logTrpcError(logger, {
          error: opts.error,
          input: opts.input,
          path: opts.path,
          type: opts.type,
        })
      },
    }),
  )

  return router
}
