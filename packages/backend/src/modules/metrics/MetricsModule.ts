import { collectDefaultMetrics } from 'prom-client'

import { Config } from '../../config'
import { ApplicationModule } from '../ApplicationModule'
import { createMetricsRouter } from './api/MetricsRouter'

export function createMetricsModule(config: Config): ApplicationModule {
  const router = createMetricsRouter(config)
  return {
    routers: [router],
    start: () => {
      collectDefaultMetrics()
    },
  }
}
