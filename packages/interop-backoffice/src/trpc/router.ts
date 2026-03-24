import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { InteropBackofficeApiImplementations } from './implementations'
import { createStatusRouter } from './routers/status'
import { router } from './trpc'
// import { Database } from '@l2beat/database'

export function createInteropTrpcRouter(
  implementations: InteropBackofficeApiImplementations,
  // db: Database
) {
  return router({
    status: createStatusRouter(implementations),
  })
}

export type InteropTrpcRouter = ReturnType<typeof createInteropTrpcRouter>
export type RouterOutputs = inferRouterOutputs<InteropTrpcRouter>
export type RouterInputs = inferRouterInputs<InteropTrpcRouter>
