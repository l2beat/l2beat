import Router from '@koa/router'

import type { UpdateMonitorController } from './UpdateMonitorController'

export function createUpdateMonitorRouter(
  updateMonitorController: UpdateMonitorController,
) {
  const router = new Router()

  router.get('/status/discovery', async (ctx) => {
    const queryEmoji = ctx.query.emoji
    const rawEmoji =
      typeof queryEmoji === 'string'
        ? queryEmoji
        : Array.isArray(queryEmoji) && queryEmoji.length > 0
          ? queryEmoji[0]
          : undefined
    const trimmedEmoji = rawEmoji?.trim()
    const selectedEmoji =
      trimmedEmoji && trimmedEmoji.length > 0 ? trimmedEmoji : undefined

    ctx.body =
      await updateMonitorController.getDiscoveryDashboard(selectedEmoji)
  })

  router.get('/discovery/changes', async (ctx) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    ctx.body = await updateMonitorController.getUpdates()
  })

  return router
}
