import type { Database } from '@l2beat/database'
import type { InteropFeatureConfig } from '../../../../../../config/Config'
import type { InteropSyncersManager } from '../../../sync/InteropSyncersManager'
import type { ProcessorStatus } from '../../impls/processors'
import { createInteropTrpcRouter } from '../router'
import { createTRPCContext } from '../trpc'
import { createKoaMiddleware } from './koa-middleware'

type Dependencies = {
  aggregationConfigs: InteropFeatureConfig['aggregation']
  db: Database
  getExplorerUrl: (chain: string) => string | undefined
  syncersManager: InteropSyncersManager
  getProcessorStatuses: () => ProcessorStatus[]
  dashboard: InteropFeatureConfig['dashboard']
}

type Options = {
  prefix?: `/${string}`
}

export function getInteropTrpcRouterDeps(deps: Dependencies) {
  return {
    aggregationConfigs: deps.aggregationConfigs
      ? deps.aggregationConfigs.configs
      : [],
    getExplorerUrl: deps.getExplorerUrl,
    getChainsForPlugin: (pluginName: string) =>
      deps.syncersManager.getChainsForPlugin(pluginName),
    getPluginSyncStatuses: () => deps.syncersManager.getPluginSyncStatuses(),
    getProcessorStatuses: deps.getProcessorStatuses,
  }
}

export function createInteropTrpc(deps: Dependencies, options?: Options) {
  return createKoaMiddleware({
    router: createInteropTrpcRouter(getInteropTrpcRouterDeps(deps)),
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
