import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { createChainsRouter } from './routers/chains'
import { createEventsRouter } from './routers/events'
import { createStatusRouter } from './routers/status'
import { router } from './trpc'

export function createInteropTrpcRouter(deps: {
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return router({
    chains: createChainsRouter(deps),
    events: createEventsRouter(),
    status: createStatusRouter(),
  })
}

export type InteropTrpcRouter = ReturnType<typeof createInteropTrpcRouter>
export type RouterOutputs = inferRouterOutputs<InteropTrpcRouter>
export type RouterInputs = inferRouterInputs<InteropTrpcRouter>
