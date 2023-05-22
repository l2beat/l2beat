import Router from '@koa/router'
import { Logger } from '@l2beat/shared'
import Koa, { Context } from 'koa'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'

import { createApiLogger } from './middleware/logger'
import { createApiMetrics } from './middleware/metrics'

export class ApiServer {
  private readonly app: Koa

  constructor(
    private readonly port: number,
    private readonly logger: Logger,
    routers: Router[],
    handleServerError?: (logger: Logger, error: Error, ctx: Context) => void,
  ) {
    this.logger = this.logger.for(this)
    this.app = new Koa()

    this.app.use(createApiMetrics())
    this.app.use(createApiLogger(this.logger))
    this.app.use(conditional())
    this.app.use(etag())

    const router = new Router()

    for (const childRouter of routers) {
      router.use(childRouter.routes(), childRouter.allowedMethods())
    }

    this.app.use(router.routes())
    this.app.use(router.allowedMethods())

    if (handleServerError) {
      this.app.on('error', (err: Error, ctx: Context) =>
        handleServerError(this.logger, err, ctx),
      )
    }
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
