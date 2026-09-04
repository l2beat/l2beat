import express from 'express'
import {
  STATIC_PAGE_EDGE_SECONDS,
  setPageCacheHeaders,
} from '~/server/middlewares/PageCacheMiddleware'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '../../utils/Manifest'
import { getFaqData } from './getFaqData'

export function createFaqRouter(manifest: Manifest, render: RenderFunction) {
  const router = express.Router()

  router.get('/faq', async (req, res) => {
    const data = await getFaqData(manifest, req.originalUrl)
    const html = await render(data, req.originalUrl)
    setPageCacheHeaders(res, { edgeSeconds: STATIC_PAGE_EDGE_SECONDS })
    res.status(200).send(html)
  })

  return router
}
