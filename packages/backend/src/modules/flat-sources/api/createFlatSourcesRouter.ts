import Router from '@koa/router'
import { FLAT_SOURCES_ZSTD_WINDOW_LOG } from '@l2beat/shared-pure'
import { pipeline, Readable } from 'stream'
import { constants, createZstdCompress } from 'zlib'

import type { FlatSourcesController } from './FlatSourcesController'

export function createFlatSourcesRouter(controller: FlatSourcesController) {
  const router = new Router()
  let streaming = false

  router.get('/api/flat-sources', (ctx) => {
    if (streaming) {
      ctx.status = 503
      ctx.body = 'Flat sources are already being streamed, retry later'
      return
    }
    streaming = true
    ctx.type = 'application/zstd'
    ctx.compress = false
    ctx.body = pipeline(
      Readable.from(controller.streamFlatSources(), {
        objectMode: true,
        highWaterMark: 1,
      }),
      createZstdCompress({
        params: {
          [constants.ZSTD_c_compressionLevel]: 3,
          [constants.ZSTD_c_windowLog]: FLAT_SOURCES_ZSTD_WINDOW_LOG,
          [constants.ZSTD_c_enableLongDistanceMatching]: 1,
        },
      }),
      (error) => {
        streaming = false
        if (error) {
          ctx.res.destroy(error)
        }
      },
    )
  })

  return router
}
