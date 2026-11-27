import type { NextFunction, Request, Response } from 'express'

/** Lets browser dashboards call the API from any origin. */
export function corsMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
      // No header changes the answer, so any may be sent: an older
      // integration still sends x-api-key, and its preflight must pass
      const requestedHeaders = req.header('Access-Control-Request-Headers')
      if (requestedHeaders) {
        res.setHeader('Access-Control-Allow-Headers', requestedHeaders)
        res.setHeader('Vary', 'Access-Control-Request-Headers')
      }
      res.setHeader('Access-Control-Max-Age', '86400')
      res.status(204).end()
      return
    }

    next()
  }
}
