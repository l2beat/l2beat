import Router from "@koa/router"

import { FlatSourcesController } from './FlatSourcesController'

export function createFlatSourcesRouter(
  controller: FlatSourcesController,
) {
  const router = new Router()

  router.get('/api/flat-sources', async (ctx) => {
    ctx.body = await controller.getFlatSources()
  })

  return router
}
