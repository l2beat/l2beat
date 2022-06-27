import Router from '@koa/router'

import { StatusController } from '../controllers/status/StatusController'

export function createStatusRouter(statusController: StatusController) {
  const router = new Router()

  router.get('/status/prices', async (ctx) => {
    ctx.body = await statusController.getPricesStatus()
  })

  router.get('/status/balances', async (ctx) => {
    ctx.body = await statusController.getBalancesStatus()
  })

  router.get('/status/reports', async (ctx) => {
    ctx.body = await statusController.getReportsStatus()
  })

  return router
}
