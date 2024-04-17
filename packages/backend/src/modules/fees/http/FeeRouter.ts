import Router from '@koa/router'

import { FeeController } from './FeeController'

export function createFeeRouter(controller: FeeController) {
  const router = new Router()

  router.get('/api/fees', async (ctx) => {
    ctx.body = await controller.getFees()
  })

  return router
}
