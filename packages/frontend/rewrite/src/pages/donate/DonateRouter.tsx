import type { Router } from 'express'
import type { RenderFunction } from 'rewrite/src/ssr/types'
import type { Manifest } from '../../../../src/utils/Manifest'
import { getDonateData } from './getDonateData'

export function DonateRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/donate', async (req, res) => {
    const data = await getDonateData(manifest, req.originalUrl)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}
