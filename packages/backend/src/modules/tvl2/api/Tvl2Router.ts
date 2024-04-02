import Router from '@koa/router'

import { Tvl2Controller } from './Tvl2Controller'

export function createTvl2Router(controller: Tvl2Controller) {
  const router = new Router()

  router.get('/api/tvl2', async () => {
    return await controller.getTvl()
  })

  return router
}
