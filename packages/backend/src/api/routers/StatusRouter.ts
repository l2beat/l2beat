import Router from '@koa/router'
import { UnixTime } from '@l2beat/common'
import { ParsedUrlQuery } from 'querystring'

import { StatusController } from '../controllers/status/StatusController'

export function createStatusRouter(statusController: StatusController) {
  const router = new Router()

  router.get('/status/prices', async (ctx) => {
    const { from, to } = getParams(ctx.query)

    ctx.body = await statusController.getPricesStatus(from, to)
  })

  router.get('/status/balances', async (ctx) => {
    const { from, to } = getParams(ctx.query)

    ctx.body = await statusController.getBalancesStatus(from, to)
  })

  router.get('/status/reports', async (ctx) => {
    const { from, to } = getParams(ctx.query)

    ctx.body = await statusController.getReportsStatus(from, to)
  })

  return router
}

function getParams(query: ParsedUrlQuery): {
  from: UnixTime | undefined
  to: UnixTime | undefined
} {
  const from = query.from ? new UnixTime(+query.from) : undefined
  const to = query.to ? new UnixTime(+query.to) : undefined

  return { from, to }
}
