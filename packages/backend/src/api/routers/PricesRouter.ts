import Router from '@koa/router'
import { AssetId, Exchange } from '@l2beat/common'

import { PricesController } from '../controllers/PricesController'

export function createPricesRouter(pricesController: PricesController) {
  const router = new Router()

  router.get('/api/prices/:assetId', async (ctx) => {
    ctx.body = await pricesController.getPriceHistory(
      AssetId(ctx.params.assetId)
    )
  })

  router.get('/api/prices/:assetId/:exchange', async (ctx) => {
    ctx.body = await pricesController.getPriceHistoryOnExchange(
      AssetId(ctx.params.assetId),
      Exchange.fromName(ctx.params.exchange)
    )
  })

  return router
}
