import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '../../utils/Manifest'
import { getFaqData } from './getFaqData'

export function createFaqRouter(manifest: Manifest, render: RenderFunction) {
  const router = express.Router()

  router.get('/faq', async (req, res) => {
    const data = await getFaqData(manifest, req.originalUrl)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}
