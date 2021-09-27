import Koa from 'koa'

import { HelloService } from '../HelloService'
import { Logger } from '../Logger'
import { httpLogger } from './httpLogger'
import { createRouter } from './router'

export class HttpEndpoint {
  private app: Koa

  constructor(
    private port: number,
    private logger: Logger,
    helloService: HelloService
  ) {
    this.logger = this.logger.for(this)
    this.app = new Koa()
    const router = createRouter(helloService)
    this.app.use(httpLogger(logger))
    this.app.use(router.routes())
    this.app.use(router.allowedMethods())
  }

  listen() {
    return this.app.listen(this.port, () => {
      this.logger.info(`Listening on port ${this.port}`)
    })
  }
}
