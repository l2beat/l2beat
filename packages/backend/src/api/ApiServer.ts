import Router from '@koa/router'
import { Logger } from '@l2beat/common'
import Koa from 'koa'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'

import { createApiLogger } from './ApiLogger'

export class ApiServer {
  private app: Koa

  constructor(private port: number, private logger: Logger, routers: Router[]) {
    this.logger = this.logger.for(this)
    this.app = new Koa()

    this.app.use(createApiLogger(this.logger))
    this.app.use(conditional())
    this.app.use(etag())

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
