import { createMetricsRouter } from '../../api/routers/MetricsRouter'
import { Metrics } from '../../Metrics'
import { ApplicationModule } from '../ApplicationModule'

export function createMetricsModule(metrics: Metrics): ApplicationModule {
  const router = createMetricsRouter(metrics)
  return {
    routers: [router],
    start: () => {
      metrics.init()
    },
  }
}
