import Router from '@koa/router'
import { AssetType, ChainId, stringAs, UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'

import { StatusController } from '../controllers/status/StatusController'
import { withTypedContext } from './types'

const queryParser = z.object({
  query: z.object({
    from: stringAs((s) => new UnixTime(+s)).optional(),
    to: stringAs((s) => new UnixTime(+s)).optional(),
    chainId: stringAs((s) => ChainId(+s)).optional(),
    type: stringAs((s) => AssetType(s)).optional(),
  }),
})

export function createStatusRouter(statusController: StatusController) {
  const router = new Router()

  router.get('/status', (ctx) => {
    ctx.body = statusController.getStatusPagesLinks()
  })

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
    '/status/discovery/:chain/:project',
    withTypedContext(
      z.object({
        params: z.object({
          chain: z.string(),
          project: z.string(),
        }),
      }),
      async (ctx) => {
        ctx.body = await statusController.getDiscoveryDashboardProject(
          ctx.params.project,
          ctx.params.chain,
        )
      },
    ),
  )

  router.get('/status/liveness', async (ctx) => {
    ctx.body = await statusController.getLivenessStatus()
  })

  return router
}
