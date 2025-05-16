import type { Router } from 'express'
import type { RenderFunction } from 'rewrite/src/ssr/types'
import type { Manifest } from '../../../../src/utils/Manifest'
import { getGlossaryData } from './getGlossaryData'

export function GlossaryRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/glossary', async (req, res) => {
    const data = await getGlossaryData(manifest, req.originalUrl)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}
