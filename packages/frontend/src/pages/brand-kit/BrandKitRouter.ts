import express from 'express'
import { sendPage } from '~/server/utils/sendPage'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '../../utils/Manifest'
import { getBrandKitData } from './getBrandKitData'

export function createBrandKitRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  const router = express.Router()

  router.get('/brand-kit', async (req, res) => {
    const data = await getBrandKitData(manifest, req.originalUrl)
    const html = await render(data, req.originalUrl)
    sendPage(res, html)
  })

  return router
}
