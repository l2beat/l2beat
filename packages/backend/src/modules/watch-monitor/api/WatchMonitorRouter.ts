import Router from '@koa/router'
import { createHash, timingSafeEqual } from 'crypto'
import type { WatchMonitorController } from './WatchMonitorController'

const BEARER_PREFIX = 'Bearer '

export function createWatchMonitorRouter(
  controller: WatchMonitorController,
  readToken: string | undefined,
) {
  const router = new Router()

  router.get('/watch/pending', async (ctx) => {
    if (readToken === undefined || readToken === '') {
      ctx.status = 404
      ctx.body = ''
      return
    }
    if (!isAuthorized(ctx.get('authorization'), readToken)) {
      ctx.status = 401
      ctx.body = ''
      return
    }
    ctx.body = await controller.getPendingWatches()
  })

  router.get('/status/watch/llms.txt', async (ctx) => {
    ctx.set('Content-Type', 'text/markdown; charset=utf-8')
    ctx.body = await controller.getWatchDashboardMarkdown()
  })

  router.get('/status/watch/:watchName.html.md', async (ctx) => {
    const markdown = await controller.getWatchMarkdown(ctx.params.watchName)
    if (markdown === null) {
      ctx.status = 404
      ctx.body = 'Watch not found'
      return
    }
    ctx.set('Content-Type', 'text/markdown; charset=utf-8')
    ctx.body = markdown
  })

  return router
}

function isAuthorized(header: string, expectedToken: string): boolean {
  // HTTP authentication scheme names are case-insensitive.
  const scheme = header.slice(0, BEARER_PREFIX.length)
  if (scheme.toLowerCase() !== BEARER_PREFIX.toLowerCase()) {
    return false
  }
  const provided = header.slice(BEARER_PREFIX.length)
  if (provided === '') {
    return false
  }
  // Comparing fixed-size digests avoids leaking the expected token length.
  const expectedDigest = createHash('sha256').update(expectedToken).digest()
  const providedDigest = createHash('sha256').update(provided).digest()
  return timingSafeEqual(expectedDigest, providedDigest)
}
