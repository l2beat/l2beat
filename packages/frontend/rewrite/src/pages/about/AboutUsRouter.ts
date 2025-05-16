import type { Router } from 'express'
import type { RenderFunction } from 'rewrite/src/ssr/types'
import type { Manifest } from '../../../../src/utils/Manifest'
import { getAboutUsData } from './getAboutUsData'

export function AboutUsRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/about-us', async (req, res) => {
    const data = await getAboutUsData(manifest, req.originalUrl)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}
