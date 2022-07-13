import Router from '@koa/router'
import { UnixTime } from '@l2beat/common'
import { ParsedUrlQuery } from 'querystring'

import { StatusController } from '../controllers/status/StatusController'

export function createStatusRouter(statusController: StatusController) {
  const router = new Router()

  router.get('/status/prices', async (ctx) => {
    const {from,to} = getFromTo(ctx.query)
    
    ctx.body = await statusController.getPricesStatus(from, to)
  })

  router.get('/status/balances', async (ctx) => {
    const {from,to} = getFromTo(ctx.query)

    ctx.body = await statusController.getBalancesStatus(from, to)
  })

  router.get('/status/reports', async (ctx) => {
    ctx.body = await statusController.getReportsStatus()
  })

  return router
}

function getFromTo(query: ParsedUrlQuery): { from: UnixTime; to: UnixTime } {
  const now = UnixTime.now()
  const from = query.from ? new UnixTime(+query.from) : now.add(-90, 'days')
  const to = query.to ? new UnixTime(+query.to) : now

  return {from,to}
}
