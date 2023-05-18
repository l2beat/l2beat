import Router from '@koa/router'
import { EthereumAddress, stringAs, UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'

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

  router.get(
    '/status/escrows/:timestamp',
    withTypedContext(
      z.object({
        params: z.object({
          timestamp: stringAs((s) => new UnixTime(+s)),
        }),
      }),
      async (ctx) => {
        const { timestamp } = ctx.params

        ctx.body = await statusController.getEscrowsDashboard(timestamp)
      },
    ),
  )

  router.get(
    '/status/escrows/:escrow/:timestamp',
    withTypedContext(
      z.object({
        params: z.object({
          escrow: stringAs((s) => EthereumAddress(s)),
          timestamp: stringAs((s) => new UnixTime(+s)),
        }),
      }),
      async (ctx) => {
        const { timestamp, escrow } = ctx.params

        ctx.body = await statusController.getSingleEscrowDashboard(
          timestamp,
          escrow,
        )
      },
    ),
  )

  return router
}
