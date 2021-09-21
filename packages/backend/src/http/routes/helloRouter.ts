import Router from '@koa/router'

import { HelloService } from '../../services/HelloService'

export function helloRouter(helloService: HelloService) {
  const router = new Router()

  router.get('/hello', async (ctx) => {
    ctx.body = helloService.getMessage()
  })

  router.get('/block-number', async (ctx) => {
    ctx.body = {
      block: await helloService.getBlockNumber(),
    }
  })

  return router
}
