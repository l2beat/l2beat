import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { mergeRouters } from '../../trpc/init'
import type { InteropTrpcRouter } from '../interop/engine/dashboard/trpc/router'

export interface BackofficeSubRouters {
  interop: InteropTrpcRouter
}

export function createAppRouter(subRouters: BackofficeSubRouters) {
  return mergeRouters(subRouters.interop)
}

export type AppRouter = ReturnType<typeof createAppRouter>
export type AppRouterInputs = inferRouterInputs<AppRouter>
export type AppRouterOutputs = inferRouterOutputs<AppRouter>
