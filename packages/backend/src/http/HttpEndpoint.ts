import Koa from 'koa'

import { Config } from '../config'
import { Services } from '../services'
import { httpLogger } from './httpLogger'
import { createRouter } from './router'

export class HttpEndpoint {
  private app: Koa

  constructor(private config: Config, private services: Services) {
    this.app = new Koa()
    const router = createRouter(this.config, this.services)
    this.app.use(httpLogger(services.logger))
    this.app.use(router.routes())
    this.app.use(router.allowedMethods())
  }

  listen() {
    return this.app.listen(this.config.port, () => {
      this.services.logger
        .for(this)
        .info(`Listening on port ${this.config.port}`)
    })
  }
}
