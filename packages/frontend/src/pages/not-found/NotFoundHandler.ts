import type { NextFunction, Request, Response } from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getNotFoundData } from './getNotFoundData'

/**
 * Renders the 404 page for GET/HEAD page requests no route handled, including
 * page routes that found no data for their params and called `next()`.
 * Other methods and non-page namespaces such as /api fall through to the
 * default Express 404 response.
 */
export function NotFoundHandler(manifest: Manifest, render: RenderFunction) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (
      (req.method !== 'GET' && req.method !== 'HEAD') ||
      req.path.startsWith('/api/')
    ) {
      next()
      return
    }
    try {
      const data = await getNotFoundData(manifest, req.originalUrl)
      const html = await render(data, req.originalUrl)
      res.status(404).send(html)
    } catch (error) {
      next(error)
    }
  }
}
