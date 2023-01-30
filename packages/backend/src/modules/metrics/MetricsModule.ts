import { createMetricsRouter } from '../../api/routers/MetricsRouter'
import { Config } from '../../config'
import { Metrics } from '../../Metrics'
import { ApplicationModule } from '../ApplicationModule'

export function createMetricsModule(
  config: Config,
  metrics: Metrics,
): ApplicationModule {
  const router = createMetricsRouter(config, metrics)
  return {
    routers: [router],
    start: () => {
      metrics.collectDefaultMetrics()
    },
  }
}
