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
