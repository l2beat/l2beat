import type { DataAvailabilityTrackingConfig } from '../../../config/Config'
import { router } from '../../../trpc/init'
import { createDaTrackingStatusRouter } from './status'

export function createDataAvailabilityTrpcRouter(deps: {
  config: DataAvailabilityTrackingConfig
}) {
  return router({
    status: createDaTrackingStatusRouter(deps),
  })
}

export type DataAvailabilityTrpcRouter = ReturnType<
  typeof createDataAvailabilityTrpcRouter
>
