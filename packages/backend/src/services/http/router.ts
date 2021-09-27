import Router from '@koa/router'

import { HelloService } from '../HelloService'
import { helloRouter } from './routes/helloRouter'

export function createRouter(helloService: HelloService) {
  const router = new Router()

  function use(nested: Router) {
    router.use(nested.routes(), nested.allowedMethods())
  }

  use(helloRouter(helloService))

  return router
}
