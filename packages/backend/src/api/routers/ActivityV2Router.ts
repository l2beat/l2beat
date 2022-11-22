import Router from '@koa/router'

import { ActivityV2Controller } from '../controllers/activity-v2/ActivityV2Controller'

export function createActivityV2Router(
  activityController: ActivityV2Controller,
) {
  const router = new Router()

  router.get('/api/activity/v2', async (ctx) => {
    const data = await activityController.getActivity()
    ctx.body = data
  })

  router.get('/api/activity/v2/counts', async (ctx) => {
    const data = await activityController.getDailyCounts()
    ctx.body = data
  })

  return router
}
