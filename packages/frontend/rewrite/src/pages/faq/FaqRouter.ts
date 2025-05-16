import type { Router } from 'express'
import type { RenderFunction } from 'rewrite/src/ssr/types'
import type { Manifest } from '../../../../src/utils/Manifest'
import { getFaqData } from './getFaqData'

export function FaqRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/faq', async (req, res) => {
    const data = await getFaqData(manifest, req.originalUrl)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}
