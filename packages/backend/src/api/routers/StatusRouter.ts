import Router from '@koa/router'
import { UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'

import { stringAs } from '../../tools/types'
import { StatusController } from '../controllers/status/StatusController'
import { withTypedContext } from './types'

const queryParser = z.object({
  query: z.object({
    from: stringAs((s) => new UnixTime(+s)).optional(),
    to: stringAs((s) => new UnixTime(+s)).optional(),
  }),
})

const paramsParser = z.object({
  params: z.object({
    project: z.string(),
  }),
})

export function createStatusRouter(statusController: StatusController) {
  const router = new Router()

  router.get(
    '/status/prices',
    withTypedContext(queryParser, async (ctx) => {
      const { from, to } = ctx.query

      ctx.body = await statusController.getPricesStatus(from, to)
    }),
  )

  router.get(
    '/status/balances',
    withTypedContext(queryParser, async (ctx) => {
      const { from, to } = ctx.query

      ctx.body = await statusController.getBalancesStatus(from, to)
    }),
  )

  router.get(
    '/status/reports',
    withTypedContext(queryParser, async (ctx) => {
      const { from, to } = ctx.query

      ctx.body = await statusController.getReportsStatus(from, to)
    }),
  )

  router.get('/status/discovery', async (ctx) => {
    ctx.body = await statusController.getDiscoveryDashboard()
  })

  router.get(
    '/status/discovery/:project',
    withTypedContext(paramsParser, async (ctx) => {
      const { project } = ctx.params
      ctx.body = await statusController.getDiscoveryDashboardProject(project)
    }),
  )

  return router
}
