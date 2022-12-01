import Router from '@koa/router'

import { ActivityController } from '../controllers/activity/ActivityController'

export function createActivityRouter(activityController: ActivityController) {
  const router = new Router()

  router.get('/api/activity', async (ctx) => {
    const data = await activityController.getActivity()
    ctx.body = data
  })

  router.get('/api/activity/status', async (ctx) => {
    const data = await activityController.getStatus()
    ctx.body = data
  })

  return router
}
