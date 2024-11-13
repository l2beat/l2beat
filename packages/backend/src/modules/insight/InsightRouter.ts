import Router from '@koa/router'
import { InsightPriceRefresher } from './InsightPriceRefresher'

export function createInsightRouter(priceRefresher: InsightPriceRefresher) {
  const router = new Router()

  router.get('/insight/refresh-tokens', async (ctx) => {
    await priceRefresher.refresh({ onlyNewTokens: true })
    ctx.body = 'OK'
  })

  return router
}
