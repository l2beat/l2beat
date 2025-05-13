import type { Router } from 'express'
import type { Manifest } from '../../../../src/utils/Manifest'
import type { RenderFunction } from '../../ssr/server'
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
