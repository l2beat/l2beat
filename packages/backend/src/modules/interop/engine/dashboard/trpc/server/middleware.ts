import type { Database } from '@l2beat/database'
import { createInteropTrpcRouter } from '../router'
import { createTRPCContext } from '../trpc'
import { createKoaMiddleware } from './koa-middleware'

type Dependencies = {
  db: Database
  getExplorerUrl: (chain: string) => string | undefined
}

type Options = {
  prefix?: `/${string}`
}

export function createInteropTrpc(deps: Dependencies, options?: Options) {
  return createKoaMiddleware({
    router: createInteropTrpcRouter({
      getExplorerUrl: deps.getExplorerUrl,
    }),
    prefix: options?.prefix,
    allowMethodOverride: true,
    createContext: ({ req }) =>
      createTRPCContext({
        headers: new Headers(req.headers as Record<string, string>),
        db: deps.db,
      }),
  })
}
