import Router from '@koa/router'

import { HealthController } from '../controllers/HealthController'

export function createHealthRouter(healthController: HealthController) {
  const router = new Router()

  router.get('/health', (ctx) => {
    const data = healthController.getStatus()

    ctx.body = data
  })

  return router
}
