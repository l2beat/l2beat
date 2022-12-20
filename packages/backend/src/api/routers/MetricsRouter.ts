import Router from '@koa/router'
import auth from 'basic-auth'

import { Config } from '../../config'
import { Metrics } from '../../Metrics'

export function createMetricsRouter(config: Config, metrics: Metrics) {
  const router = new Router()

  router.get('/metrics', async (ctx) => {
    const credentials = auth(ctx.req)

    if (!credentials || !check(config, credentials.name, credentials.pass)) {
      ctx.status = 401
      ctx.set('WWW-Authenticate', 'Basic realm="metrics"')
      return
    }

    ctx.body = await metrics.getMetrics()
  })

  return router
}

function check(config: Config, name: string, pass: string) {
  let valid = true

  valid = name === config.metrics.user && valid
  valid = pass === config.metrics.pass && valid

  return valid
}
