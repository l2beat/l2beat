import Router from '@koa/router'
import { z } from 'zod'

import { withTypedContext } from '../../../api/types'
import type { UpdateMonitorController } from './UpdateMonitorController'

export function createUpdateMonitorRouter(
  updateMonitorController: UpdateMonitorController,
) {
  const router = new Router()

  router.get('/status/discovery', async (ctx) => {
    ctx.body = await updateMonitorController.getDiscoveryDashboard()
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
        ctx.body = await updateMonitorController.getDiscoveryDashboardProject(
          ctx.params.project,
          ctx.params.chain,
        )
      },
    ),
  )

  router.get('/discovery/changes', async (ctx) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    ctx.body = await updateMonitorController.getUpdates()
  })

  return router
}
