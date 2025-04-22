import type { Router } from 'express'
import type { Manifest } from '../../common/Manifest'
import type { RenderFunction } from '../../ssr/server'
import { getAboutUsData } from './getAboutUsData'

export function AboutUsRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/about-us', async (req, res) => {
    const data = await getAboutUsData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}
