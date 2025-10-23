import type { Logger } from '@l2beat/backend-tools'
import type { NextFunction, Request, Response } from 'express'
import { getContext } from '../context/context'

export function loggerMiddleware(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction) => {
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

function getParamsWithoutApiKey(url: string) {
  const [urlWithoutParams, ...queryParamsString] = url.split('?')
  const params = queryParamsString.join('?').split('&')
  const result: Record<string, string> = {}
  for (const param of params) {
    const [key, value] = param.split('=')
    if (!key || !value) {
      continue
    }
    if (key === 'apiKey') {
      continue
    }
    result[key] = value
  }
  return {
    url: urlWithoutParams,
    queryParams: Object.keys(result).length > 0 ? result : undefined,
  }
}
