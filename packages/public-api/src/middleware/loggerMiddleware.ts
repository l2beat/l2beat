import type { Logger } from '@l2beat/backend-tools'
import type { NextFunction, Request, Response } from 'express'
import { getRequestHops, getRequestIp } from '../utils/getRequestIp'

export function loggerMiddleware(logger: Logger) {
  logger = logger.for('Http')
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['user-agent']?.includes('Cloudflare-Healthchecks')) {
      return next()
    }

    const ip = getRequestIp(req)
    const hops = getRequestHops(req)
    const { queryParams, url } = getParamsWithoutApiKey(req.originalUrl)
    logger.info('Processing request', {
      method: req.method,
      url,
      queryParams,
      referer: req.headers.referer ?? 'unknown',
      userAgent: req.headers['user-agent'] ?? 'unknown',
      ip,
      ...hops,
    })

    const start = process.hrtime.bigint()
    res.once('finish', () => {
      const end = process.hrtime.bigint()
      const durationMs = Number(end - start) / 1_000_000
      const contentLength = res.getHeader('Content-Length')
      const { queryParams, url } = getParamsWithoutApiKey(req.originalUrl)
      logger.info('Request processed', {
        method: req.method,
        url,
        queryParams,
        status: res.statusCode,
        duration: Math.round(durationMs),
        size: contentLength ? Number(contentLength) : undefined,
        referer: req.headers.referer ?? 'unknown',
        userAgent: req.headers['user-agent'] ?? 'unknown',
        ip,
        ...hops,
      })
    })

    next()
  }
}

const dummyUrl = 'https://api.l2beat.com'

/**
 * Keys are no longer checked, but partners who were given one may still send
 * it, and a secret must not end up in the logs.
 */
export function getParamsWithoutApiKey(url: string) {
  const urlObj = new URL(`${dummyUrl}${url}`)
  urlObj.searchParams.delete('apiKey')
  const queryParams = Object.fromEntries(urlObj.searchParams.entries())

  return {
    url: urlObj.pathname,
    queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  }
}
