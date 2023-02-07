import { collectDefaultMetrics } from 'prom-client'

import { createMetricsRouter } from '../../api/routers/MetricsRouter'
import { Config } from '../../config'
import { ApplicationModule } from '../ApplicationModule'

export function createMetricsModule(config: Config): ApplicationModule {
  const router = createMetricsRouter(config)
  return {
    routers: [router],
    start: () => {
      collectDefaultMetrics()
    },
  }
}
