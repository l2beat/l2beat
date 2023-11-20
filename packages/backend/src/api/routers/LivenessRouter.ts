import Router from '@koa/router'

import { LivenessController } from '../controllers/liveness/LivenessController'

export function createLivenessRouter(livenessController: LivenessController) {
  const router = new Router()

  router.get('/api/liveness', async (ctx) => {
    ctx.body = await livenessController.getLiveness()
  })
  
  router.get('/api/liveness', async (ctx) => {
    ctx.body = await livenessController.getLiveness()
  })

  return router
}
