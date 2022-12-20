import Router from '@koa/router'

import { Metrics } from '../../Metrics'

export function createMetricsRouter(metrics: Metrics) {
  const router = new Router()

  router.get('/metrics', async (ctx) => {
    ctx.body = await metrics.getMetrics()
  })

  return router
}
