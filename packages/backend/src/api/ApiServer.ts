import Router from '@koa/router'
import { Logger } from '@l2beat/backend-tools'
import Koa from 'koa'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'

import { BugsnagPluginKoaResult } from '../tools/ErrorReporter'
import { createApiLogger } from './middleware/logger'
import { createApiMetrics } from './middleware/metrics'

export class ApiServer {
  private readonly app: Koa

  constructor(
    private readonly port: number,
    private readonly logger: Logger,
    routers: Router[],
    errorReporterMiddleware?: BugsnagPluginKoaResult,
  ) {
    this.logger = this.logger.for(this)
    this.app = new Koa()

    if (errorReporterMiddleware) {
      // This must be the first piece of middleware in the stack.
      // It can only capture errors in downstream middleware
      this.app.use(errorReporterMiddleware.requestHandler)

      // This handles any errors that Koa catches
      this.app.on('error', errorReporterMiddleware.errorHandler)
      logger.info('Bugsnag koa integration enabled')
    }

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
