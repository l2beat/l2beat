import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '../../utils/Manifest'
import { getGardenData } from './getGardenData'

export function createGardenRouter(manifest: Manifest, render: RenderFunction) {
  const router = express.Router()

  router.get('/garden', async (req, res) => {
    const data = await getGardenData(manifest, req.originalUrl)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}
