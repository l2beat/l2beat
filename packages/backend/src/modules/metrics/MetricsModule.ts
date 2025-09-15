import { collectDefaultMetrics } from 'prom-client'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { createMetricsRouter } from './MetricsRouter'

export function createMetricsModule({
  config,
}: ModuleDependencies): ApplicationModule {
  const router = createMetricsRouter(config)
  return {
    routers: [router],
    start: () => {
      collectDefaultMetrics()
    },
  }
}
