import Router from '@koa/router'

import { LivenessController } from '../controllers/liveness/LivenessController'

export function createLivenessRouter(livenessController: LivenessController) {
  const router = new Router()

  router.get('/api/liveness', async (ctx) => {
    const result = await livenessController.getLiveness()

    if (result.type === 'error') {
      ctx.status = 422
      ctx.body = result.error
      return
    }
    ctx.body = result.data
  })

  return router
}
