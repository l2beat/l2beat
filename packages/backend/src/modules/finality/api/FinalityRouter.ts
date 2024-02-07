import Router from '@koa/router'

import { FinalityController } from './FinalityController'

export function createFinalityRouter(finalityController: FinalityController) {
  const router = new Router()

  router.get('/api/finality', async (ctx) => {
    const result = await finalityController.getFinality()

    if (result.type === 'error') {
      ctx.status = 404
      ctx.body = result.error
      return
    }
    ctx.body = result.data
  })

  return router
}
