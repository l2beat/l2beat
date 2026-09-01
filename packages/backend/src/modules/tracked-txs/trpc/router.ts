import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { TrackedTxProject } from '../../../config/Config'
import { router } from '../../../trpc/init'
import { createTrackedTxsStatusRouter } from './status'

export function createTrackedTxsTrpcRouter(deps: {
  projects: TrackedTxProject[]
}) {
  return router({
    status: createTrackedTxsStatusRouter(deps),
  })
}

export type TrackedTxsTrpcRouter = ReturnType<typeof createTrackedTxsTrpcRouter>
export type RouterOutputs = inferRouterOutputs<TrackedTxsTrpcRouter>
export type RouterInputs = inferRouterInputs<TrackedTxsTrpcRouter>
