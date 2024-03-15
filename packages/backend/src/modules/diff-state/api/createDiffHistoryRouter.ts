import Router from '@koa/router'

import { DiffStateController } from './DiffStateController'

export function createDiffStateRouter(controller: DiffStateController) {
  const router = new Router()

  router.get('/diff-state', async (ctx) => {
    ctx.body = await controller.getDiffState()
  })

  return router
}
