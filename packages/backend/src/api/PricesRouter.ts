import Router from '@koa/router'

import { PricesView } from '../core/views/PricesView'
import { AssetId, Exchange } from '../model'

export function createPricesRouter(pricesView: PricesView) {
  const router = new Router()

  router.get('/api/prices/:assetId', async (ctx) => {
    ctx.body = await pricesView.getPriceHistory(AssetId(ctx.params.assetId))
  })

  router.get('/api/prices/:assetId/:exchange', async (ctx) => {
    ctx.body = await pricesView.getPriceHistoryOnExchange(
      AssetId(ctx.params.assetId),
      Exchange.fromName(ctx.params.exchange)
    )
  })

  return router
}
