import type { Router } from 'express'
import type { Manifest } from '../../../../src/utils/Manifest'
import type { RenderFunction } from '../../ssr/server'
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
