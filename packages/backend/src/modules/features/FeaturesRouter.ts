import Router from '@koa/router'

import { FeaturesController } from './FeaturesController'

export function createFeaturesRouter(controller: FeaturesController) {
  const router = new Router()

  router.get('/features', (ctx) => {
    const data = controller.getRecord()

    ctx.body = data
  })

  return router
}
