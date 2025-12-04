import Router from '@koa/router'
import type { Logger } from '@l2beat/backend-tools'
import Koa from 'koa'
import compress from 'koa-compress'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'

import { createApiLogger } from './logger'

export class ApiServer {
  private readonly app: Koa

  constructor(
    private readonly port: number,
    private readonly logger: Logger,
    routers: Router[],
  ) {
    this.logger = this.logger.for(this)
    this.app = new Koa()

    this.app.use(createApiLogger(this.logger))
    this.app.on('error', (err: Error, ctx: Koa.Context) => {
      this.logger.error('Request failed', err, ctx.toJSON())
    })

    this.app.use(conditional())
    this.app.use(etag())

    const router = new Router()

    router.get('/health', (ctx) => {
      ctx.status = 200
      ctx.body = 'OK'
    })

    for (const childRouter of routers) {
      router.use(childRouter.routes(), childRouter.allowedMethods())
    }

    this.app.use(
      compress({
        threshold: 2048,
        gzip: {
          flush: require('zlib').constants.Z_SYNC_FLUSH,
        },
        deflate: {
          flush: require('zlib').constants.Z_SYNC_FLUSH,
        },
      }),
    )
    this.app.use(router.routes())
    this.app.use(router.allowedMethods())
  }

  start() {
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
