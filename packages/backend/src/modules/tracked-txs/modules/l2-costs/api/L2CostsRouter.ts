import Router from '@koa/router'

import { L2CostsController } from './L2CostsController'

export function createL2CostsRouter(l2CostsController: L2CostsController) {
  const router = new Router()

  router.get('/api/l2costs', async (ctx) => {
    const result = await l2CostsController.getL2Costs()

    if (result.type === 'error') {
      ctx.status = 404
      ctx.body = result.error
      return
    }
    ctx.body = result.data
  })

  return router
}
