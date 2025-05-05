import type { Router } from 'express'
import type { Manifest } from '../../../../src/utils/Manifest'
import type { RenderFunction } from '../../ssr/server'
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
