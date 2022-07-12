import Router from '@koa/router'
import { UnixTime } from '@l2beat/common'

import { StatusController } from '../controllers/status/StatusController'

export function createStatusRouter(statusController: StatusController) {
  const router = new Router()

  router.get('/status/prices', async (ctx) => {
    ctx.body = await statusController.getPricesStatus()
  })

  router.get('/status/balances', async (ctx) => {
    const now = UnixTime.now()
    const from = ctx.query.from
      ? new UnixTime(+ctx.query.from)
      : now.add(-90, 'days')
    const to = ctx.query.to ? new UnixTime(+ctx.query.to) : now

    ctx.body = await statusController.getBalancesStatus(from, to)
  })

  router.get('/status/reports', async (ctx) => {
    ctx.body = await statusController.getReportsStatus()
  })

  return router
}
