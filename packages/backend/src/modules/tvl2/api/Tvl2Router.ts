import Router from '@koa/router'

import { Clock } from '../../../tools/Clock'
import { Tvl2Controller } from './Tvl2Controller'

export function createTvl2Router(controller: Tvl2Controller, clock: Clock) {
  const router = new Router()

  router.get('/api/tvl2', async (ctx) => {
    const tvl = await controller.getTvl(clock.getLastHour())
    ctx.body = tvl
  })

  return router
}
