import Router from '@koa/router'
import Koa from 'koa'

import { Logger } from '../tools/Logger'
import { createApiLogger } from './ApiLogger'

export class ApiServer {
  private app: Koa

  constructor(private port: number, private logger: Logger, routers: Router[]) {
    this.logger = this.logger.for(this)
    this.app = new Koa()

    this.app.use(createApiLogger(this.logger))

    const router = new Router()

    for (const childRouter of routers) {
      router.use(childRouter.routes(), childRouter.allowedMethods())
    }

    this.app.use(router.routes())
    this.app.use(router.allowedMethods())
  }

  listen() {
    return new Promise<void>((resolve) => {
      this.app.listen(this.port, () => {
        this.logger.info({ message: 'Listening', port: this.port })
        resolve()
      })
    })
  }

  getNodeCallback() {
    return this.app.callback()
  }
}
