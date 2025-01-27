import Router from '@koa/router'
import auth from 'basic-auth'
import { register } from 'prom-client'

import type { Config } from '../../config'
import type { MetricsAuthConfig } from '../../config/Config'

export function createMetricsRouter(config: Config) {
  const router = new Router()

  router.get('/metrics', async (ctx) => {
    const credentials = auth(ctx.req)

    if (
      config.metricsAuth &&
      (!credentials ||
        !checkCredentials(
          config.metricsAuth,
          credentials.name,
          credentials.pass,
        ))
    ) {
      ctx.status = 401
      ctx.set('WWW-Authenticate', 'Basic realm="metrics"')
      return
    }

    ctx.body = await register.metrics()
  })

  return router
}

function checkCredentials(
  metricsAuth: MetricsAuthConfig,
  name: string,
  pass: string,
) {
  return name === metricsAuth.user && pass === metricsAuth.pass
}
