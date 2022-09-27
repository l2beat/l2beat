import Router from '@koa/router'

import { ActivityController } from '../controllers/ActivityController'

export function createActivityRouter(activityController: ActivityController) {
  const router = new Router()

  router.get('/api/activity', async (ctx) => {
    const data = await activityController.getTransactionActivity()
    ctx.body = data
  })

  return router
}
