import Router from '@koa/router'

import { Clock } from '../../../tools/Clock'
import { Tvl2Controller } from './Tvl2Controller'

export function createTvl2Router(tvlController: Tvl2Controller, clock: Clock) {
  const router = new Router()

  router.get('/api/tvl2', async (ctx) => {
    const timestamp = clock.getLastHour()
    const tvl = await tvlController.getTvl(timestamp)
    ctx.body = tvl
    // TODO: compress response using https://github.com/koajs/compress
  })

  return router
}
