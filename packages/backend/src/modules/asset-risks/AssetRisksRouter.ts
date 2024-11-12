import Router from '@koa/router'
import { AssetRisksPriceRefresher } from './AssetRisksPriceRefresher'

export function createAssetRisksRouter(
  priceRefresher: AssetRisksPriceRefresher,
) {
  const router = new Router()

  router.get('/asset-risks/refresh-tokens', async (ctx) => {
    await priceRefresher.refresh({ onlyNewTokens: true })
    ctx.body = 'OK'
  })

  return router
}
