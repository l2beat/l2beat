import express from 'express'
import { env } from '~/env'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getBlobsPageData } from './getBlobsPageData'

export function createBlobsRouter(manifest: Manifest, render: RenderFunction) {
  if (!env.CLIENT_SIDE_BLOBS_PAGE) return null
  const router = express.Router()

  router.get('/blobs', async (req, res) => {
    const data = await getBlobsPageData(manifest, req.originalUrl)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}
