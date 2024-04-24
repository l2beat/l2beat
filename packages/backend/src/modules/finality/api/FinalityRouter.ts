import Router from '@koa/router'

import { FinalityController } from './FinalityController'

export function createFinalityRouter(finalityController: FinalityController) {
  const router = new Router()

  router.get('/api/finality', async (ctx) => {
    const result = await finalityController.analyze()

    ctx.body = result
  })

  return router
}
