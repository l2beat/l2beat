import Router from '@koa/router'

import type { FlatSourcesController } from './FlatSourcesController'

export function createFlatSourcesRouter(controller: FlatSourcesController) {
  const router = new Router()

  router.get('/api/flat-sources', async (ctx) => {
    const response = await controller.getFlatSources()
    ctx.body = response
    ctx.response.length = response.length
  })

  return router
}
