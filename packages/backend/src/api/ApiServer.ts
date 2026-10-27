import Router from '@koa/router'
import type { Logger } from '@l2beat/backend-tools'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import compress from 'koa-compress'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'

import { createApiLogger } from './logger'

const CLIENT_DISCONNECT_CODES = new Set([
  'ECONNRESET',
  'EPIPE',
  'ECONNABORTED',
  'ERR_STREAM_PREMATURE_CLOSE',
])

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
    this.app.on('error', (error: NodeJS.ErrnoException, ctx: Koa.Context) => {
      if (isClientDisconnect(error, ctx)) {
        this.logger.info('Client disconnected', {
          code: error.code,
          method: ctx.method,
          url: ctx.originalUrl,
        })
        return
      }
      this.logger.error('Request failed', error, ctx.toJSON())
    })

    this.app.use(conditional())
    this.app.use(etag())
    this.app.use(bodyParser({ enableTypes: ['json'] }))

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

function isClientDisconnect(error: NodeJS.ErrnoException, ctx: Koa.Context) {
  if (ctx.res.errored) {
    return false
  }
  if (!ctx.req.socket.destroyed) {
    return false
  }
  return error.code !== undefined && CLIENT_DISCONNECT_CODES.has(error.code)
}
