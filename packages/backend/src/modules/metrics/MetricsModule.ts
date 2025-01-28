import { collectDefaultMetrics } from 'prom-client'

import type { Config } from '../../config'
import type { ApplicationModule } from '../ApplicationModule'
import { createMetricsRouter } from './MetricsRouter'

export function createMetricsModule(config: Config): ApplicationModule {
  const router = createMetricsRouter(config)
  return {
    routers: [router],
    start: () => {
      collectDefaultMetrics()
    },
  }
}
