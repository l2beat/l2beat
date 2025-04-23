import type { Router } from 'express'
import type { Manifest } from 'rewrite/src/common/Manifest'
import type { RenderFunction } from 'rewrite/src/ssr/server'
import { validateRoute } from 'rewrite/src/ssr/validateRoute'
import { z } from 'zod'
import { getBridgesArchivedData } from './archived/getBridgesArchivedData'
import { getBridgesProjectData } from './project/getBridgesProjectData'
import { getBridgesRiskData } from './risk/getBridgesRiskData'
import { getBridgesSummaryData } from './summary/getBridgesSummaryData'

export function BridgesRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/bridges', async (req, res) => {
    res.redirect('/bridges/summary')
  })

  app.get('/bridges/summary', async (req, res) => {
    const data = await getBridgesSummaryData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  app.get('/bridges/risk', async (req, res) => {
    const data = await getBridgesRiskData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  app.get('/bridges/archived', async (req, res) => {
    const data = await getBridgesArchivedData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  app.get(
    '/bridges/projects/:slug',
    validateRoute({
      params: z.object({
        slug: z.string(),
      }),
    }),
    async (req, res) => {
      const data = await getBridgesProjectData(manifest, req.params.slug)
      if (!data) {
        res.status(404).send('Not found')
        return
      }
      const html = render(data, req.originalUrl)
      res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
    },
  )
}
