import type { NextFunction, Request, Response } from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { renderNotFoundPage } from './renderNotFoundPage'

/**
 * Renders the 404 page for GET/HEAD page requests no route matched. Other
 * methods and non-page namespaces such as /api fall through to the default
 * Express 404 response.
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
      await renderNotFoundPage(manifest, render, req.originalUrl, res)
    } catch (error) {
      next(error)
    }
  }
}
