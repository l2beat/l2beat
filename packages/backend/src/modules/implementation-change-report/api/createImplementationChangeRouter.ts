import Router from '@koa/router'

import { ImplementationChangeController } from './ImplementationChangeController'

export function createImplementationChangeRouter(
  controller: ImplementationChangeController,
) {
  const router = new Router()

  router.get('/api/implementation-change-report', async (ctx) => {
    ctx.body = await controller.getImplementationChangeReport()
  })

  return router
}
