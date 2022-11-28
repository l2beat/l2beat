import Router from '@koa/router'

import { ActivityController } from '../controllers/activity/ActivityController'

export function createActivityRouter(activityController: ActivityController) {
  const router = new Router()

  router.get(['/api/activity', '/api/activity/v2'], async (ctx) => {
    const data = await activityController.getActivity()
    ctx.body = data
  })

  return router
}
