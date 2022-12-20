import Router from '@koa/router'
import auth from 'basic-auth'

import { Config } from '../../config'
import { MetricsAuthConfig } from '../../config/Config'
import { Metrics } from '../../Metrics'

export function createMetricsRouter(config: Config, metrics: Metrics) {
  const router = new Router()

  router.get('/metrics', async (ctx) => {
    const credentials = auth(ctx.req)

    if (
      config.metricsAuth &&
      (!credentials ||
        !check(config.metricsAuth, credentials.name, credentials.pass))
    ) {
      ctx.status = 401
      ctx.set('WWW-Authenticate', 'Basic realm="metrics"')
      return
    }

    ctx.body = await metrics.getMetrics()
  })

  return router
}

function check(metricsAuth: MetricsAuthConfig, name: string, pass: string) {
  let valid = true

  valid = name === metricsAuth.user && valid
  valid = pass === metricsAuth.pass && valid

  return valid
}
