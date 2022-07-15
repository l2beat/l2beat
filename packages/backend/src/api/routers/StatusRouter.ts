import Router from '@koa/router'
import { UnixTime } from '@l2beat/common'
import { z } from 'zod'

import { stringAs } from '../../tools/types'
import { StatusController } from '../controllers/status/StatusController'
import { withTypedContext } from './types'

const paramsParser = z.object({
  query: z.object({
    from: stringAs((s) => new UnixTime(+s)).optional(),
    to: stringAs((s) => new UnixTime(+s)).optional(),
  }),
})

export function createStatusRouter(statusController: StatusController) {
  const router = new Router()

  router.get(
    '/status/prices',
    withTypedContext(paramsParser, async (ctx) => {
      const { from, to } = ctx.query

      ctx.body = await statusController.getPricesStatus(from, to)
    }),
  )

  router.get(
    '/status/balances',
    withTypedContext(paramsParser, async (ctx) => {
      const { from, to } = ctx.query

      ctx.body = await statusController.getBalancesStatus(from, to)
    }),
  )

  router.get(
    '/status/reports',
    withTypedContext(paramsParser, async (ctx) => {
      const { from, to } = ctx.query

      ctx.body = await statusController.getReportsStatus(from, to)
    }),
  )

  return router
}
