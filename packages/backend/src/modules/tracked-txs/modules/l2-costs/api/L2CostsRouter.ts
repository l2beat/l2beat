import Router from '@koa/router'

import { ApiConfig } from '../../../../../config/Config'
import { L2CostsController } from './L2CostsController'

export function createL2CostsRouter(
  l2CostsController: L2CostsController,
  config: ApiConfig,
) {
  const router = new Router()

  router.get('/api/l2-costs', async (ctx) => {
    const result = config.cache.l2costs
      ? await l2CostsController.getCachedL2CostsApiResponse()
      : await l2CostsController.getL2Costs()
    ctx.body = result.data
  })

  return router
}
