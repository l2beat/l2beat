import Router from '@koa/router'

import { HealthController } from './HealthController'

export function createHealthRouter(healthController: HealthController) {
  const router = new Router()

  router.get('/health', (ctx) => {
    const data = healthController.getStatus()

    ctx.body = data
  })

  return router
}
