import Router from '@koa/router'

import { StatusController } from './StatusController'

export function createStatusRouter(statusController: StatusController) {
  const router = new Router()

  router.get('/status', (ctx) => {
    ctx.body = statusController.getStatusPagesLinks()
  })

  router.get('/status/liveness', async (ctx) => {
    ctx.body = await statusController.getLivenessStatus()
  })

  return router
}
