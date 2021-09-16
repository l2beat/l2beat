import Router from '@koa/router'

import { HelloService } from '../../services/HelloService'

export function helloRouter(helloService: HelloService) {
  const router = new Router()

  router.get('/hello', (ctx) => {
    ctx.body = helloService.getMessage()
  })

  return router
}
