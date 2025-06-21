import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '../../utils/Manifest'
import { getDonateData } from './getDonateData'

export function createDonateRouter(manifest: Manifest, render: RenderFunction) {
  const router = express.Router()

  router.get('/donate', async (req, res) => {
    const data = await getDonateData(manifest, req.originalUrl)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}
