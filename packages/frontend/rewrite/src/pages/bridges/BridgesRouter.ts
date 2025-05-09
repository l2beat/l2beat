import type { Router } from 'express'
import type { RenderFunction } from 'rewrite/src/ssr/server'
import { validateRoute } from 'rewrite/src/utils/validateRoute'
import { z } from 'zod'
import type { Manifest } from '~/utils/Manifest'
import { getBridgesArchivedData } from './archived/getBridgesArchivedData'
import { getBridgesProjectData } from './project/getBridgesProjectData'
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
    const data = await getBridgesSummaryData(manifest, req.originalUrl)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  app.get('/bridges/archived', async (req, res) => {
    const data = await getBridgesArchivedData(manifest, req.originalUrl)
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
      const data = await getBridgesProjectData(
        manifest,
        req.params.slug,
        req.originalUrl,
      )
      if (!data) {
        res.status(404).send('Not found')
        return
      }
      const html = render(data, req.originalUrl)
      res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
    },
  )
}
