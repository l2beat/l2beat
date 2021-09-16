import Router from '@koa/router'

import { Config } from '../config'
import { Services } from '../services'
import { helloRouter } from './routes/helloRouter'

export function createRouter(config: Config, services: Services) {
  const router = new Router()

  function use(nested: Router) {
    router.use(nested.routes(), nested.allowedMethods())
  }

  use(helloRouter(services.helloService))

  return router
}
