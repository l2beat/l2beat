import Router from '@koa/router'

import { LzOAppsController } from './LzOappsController'

export function createLzOAppsRouter(controller: LzOAppsController) {
  const router = new Router()

  router.get('/layerzero-oapps', (ctx) => {
    ctx.body = controller.getOApps()
  })

  return router
}
