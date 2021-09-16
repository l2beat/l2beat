import Koa from 'koa'

import { Config } from '../config'
import { Services } from '../services'
import { Logger } from '../services/Logger'
import { httpLogger } from './httpLogger'
import { createRouter } from './router'

export class HttpEndpoint {
  private app: Koa
  private logger: Logger

  constructor(private config: Config, private services: Services) {
    this.app = new Koa()
    this.logger = this.services.logger.withName('HttpEndpoint')

    const router = createRouter(this.config, this.services)
    this.app.use(httpLogger(services.logger))
    this.app.use(router.routes())
    this.app.use(router.allowedMethods())
  }

  listen() {
    return this.app.listen(this.config.port, () => {
      this.logger.info(`Listening on port ${this.config.port}`)
    })
  }
}
