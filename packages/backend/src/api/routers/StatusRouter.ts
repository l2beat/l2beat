import Router from '@koa/router'
import { ChainId, stringAs, UnixTime, ValueType } from '@l2beat/shared-pure'
import { z } from 'zod'

import { StatusController } from '../controllers/status/StatusController'
import { withTypedContext } from './types'

const queryParser = z.object({
  query: z.object({
    from: stringAs((s) => new UnixTime(+s)).optional(),
    to: stringAs((s) => new UnixTime(+s)).optional(),
    chainId: stringAs((s) => ChainId(+s)).optional(),
    type: stringAs((s) => ValueType(s)).optional(),
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
      const { chainId, from, to } = ctx.query

      ctx.body = await statusController.getBalancesStatus(chainId, from, to)
    }),
  )

  router.get(
    '/status/supplies',
    withTypedContext(queryParser, async (ctx) => {
      const { chainId, from, to } = ctx.query

      ctx.body = await statusController.getTotalSuppliesStatus(
        chainId,
        from,
        to,
      )
    }),
  )

  router.get(
    '/status/reports',
    withTypedContext(queryParser, async (ctx) => {
      const { chainId, type, from, to } = ctx.query

      ctx.body = await statusController.getReportsStatus(
        chainId,
        type,
        from,
        to,
      )
    }),
  )

  router.get(
    '/status/aggregated',
    withTypedContext(queryParser, async (ctx) => {
      const { from, to } = ctx.query

      ctx.body = await statusController.getAggregatedStatus(from, to)
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
