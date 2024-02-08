import Router from '@koa/router'
import { AssetType, ChainId, stringAs, UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'

import { withTypedContext } from '../../../api/types'
import { StatusController } from './StatusController'

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
