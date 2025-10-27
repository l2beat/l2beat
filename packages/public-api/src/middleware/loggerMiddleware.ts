import type { Logger } from '@l2beat/backend-tools'
import type { NextFunction, Request, Response } from 'express'
import { getContext } from '../context/context'

export function loggerMiddleware(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['user-agent']?.includes('Cloudflare-Healthchecks')) {
      return next()
    }

    const context = getContext()
    const { queryParams, url } = getParamsWithoutApiKey(req.originalUrl)
    logger.info('Processing request', {
      method: req.method,
      url,
      queryParams,
      referer: req.headers.referer ?? 'unknown',
      userAgent: req.headers['user-agent'] ?? 'unknown',
      user: context.user,
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
        user: context.user,
      })
    })

    next()
  }
}

const dummyUrl = 'https://api.l2beat.com'
function getParamsWithoutApiKey(url: string) {
  const urlObj = new URL(`${dummyUrl}${url}`)
  urlObj.searchParams.delete('apiKey')
  const queryParams = Object.fromEntries(urlObj.searchParams.entries())

  return {
    url: urlObj.pathname,
    queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  }
}
