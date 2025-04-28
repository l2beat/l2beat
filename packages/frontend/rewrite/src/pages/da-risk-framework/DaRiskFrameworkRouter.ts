import type { Router } from 'express'
import type { RenderFunction } from 'rewrite/src/ssr/server'
import type { Manifest } from '~/utils/Manifest'
import { getDaRiskFrameworkData } from './getDaRiskFrameworkData'

export function DaRiskFrameworkRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/da-risk', (req, res) => {
    const data = getDaRiskFrameworkData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}
