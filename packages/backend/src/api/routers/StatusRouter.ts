import Router from '@koa/router'

import { StatusController } from '../controllers/StatusController'

export function createStatusRouter(statusController: StatusController) {
  const router = new Router()

  router.get('/api/status/prices', async (ctx) => {
    ctx.body = await statusController.getPricesStatus()
  })

  return router
}
