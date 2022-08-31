import Router from '@koa/router'

import { DydxController } from '../controllers/DydxController'

export function createDydxRouter(dydxController: DydxController) {
  const router = new Router()

  router.get('/api/dydx', async (ctx) => {
    const tvl = await dydxController.getTvl()
    if (!tvl) {
      ctx.status = 404
      return
    }
    ctx.body = tvl
    ctx.set('Access-Control-Allow-Origin', 'https://dydx.l2beat.com')
  })

  return router
}
