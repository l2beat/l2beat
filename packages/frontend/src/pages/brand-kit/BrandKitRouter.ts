import express from 'express'
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
    res.status(200).send(html)
  })

  return router
}
