import type { NextFunction, Request, Response } from 'express'
import { env } from '~/env'
import { getLogger } from '../utils/logger'

export function MetricsMiddleware() {
  const logger = getLogger().for('Metrics')
  const isDev = env.NODE_ENV !== 'production'

  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['user-agent']?.includes('Cloudflare-Healthchecks')) {
      return next()
    }
    if (
      req.originalUrl === '/.well-known/appspecific/com.chrome.devtools.json'
    ) {
      return next()
    }

    if (isDev && shouldSkipDevRequest(req.originalUrl)) {
      return next()
    }

    const start = process.hrtime.bigint()
    res.once('finish', () => {
      const end = process.hrtime.bigint()
      const durationMs = Number(end - start) / 1_000_000
      const contentLength = res.getHeader('Content-Length')

      if (isDev && res.statusCode < 400 && durationMs < 750) {
        return
      }

      logger.info('Request processed', {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: Math.round(durationMs),
        size: contentLength ? Number(contentLength) : undefined,
        referer: req.headers.referer ?? 'unknown',
        userAgent: req.headers['user-agent'] ?? 'unknown',
      })
    })

    next()
  }
}

function shouldSkipDevRequest(url: string) {
  if (url.startsWith('/@vite')) {
    return true
  }
  if (url.startsWith('/node_modules/')) {
    return true
  }
  if (url.startsWith('/src/')) {
    return true
  }
  if (url.includes('?import') || url.includes('&import')) {
    return true
  }

  return /\.(css|js|map|png|jpg|jpeg|gif|svg|woff|woff2|ico)(\?.*)?$/i.test(
    url,
  )
}
