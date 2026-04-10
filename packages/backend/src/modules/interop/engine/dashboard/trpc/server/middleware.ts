import type { Database } from '@l2beat/database'
import type { InteropFeatureConfig } from '../../../../../../config/Config'
import type { ProcessorStatus } from '../../impls/processors'
import { createInteropTrpcRouter } from '../router'
import { createTRPCContext } from '../trpc'
import { createKoaMiddleware } from './koa-middleware'

type Dependencies = {
  db: Database
  getExplorerUrl: (chain: string) => string | undefined
  getProcessorStatuses: () => ProcessorStatus[]
  dashboard: InteropFeatureConfig['dashboard']
}

type Options = {
  prefix?: `/${string}`
}

export function createInteropTrpc(deps: Dependencies, options?: Options) {
  return createKoaMiddleware({
    router: createInteropTrpcRouter({
      getExplorerUrl: deps.getExplorerUrl,
      getProcessorStatuses: deps.getProcessorStatuses,
    }),
    prefix: options?.prefix,
    allowMethodOverride: true,
    createContext: ({ req }) =>
      createTRPCContext({
        headers: new Headers(req.headers as Record<string, string>),
        db: deps.db,
        dashboard: deps.dashboard,
      }),
  })
}
