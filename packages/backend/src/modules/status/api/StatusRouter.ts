import Router from '@koa/router'
import { z } from 'zod'

import { withTypedContext } from '../../../api/types'
import { StatusController } from './StatusController'

export function createStatusRouter(statusController: StatusController) {
  const router = new Router()

  router.get('/status', (ctx) => {
    ctx.body = statusController.getStatusPagesLinks()
  })

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
