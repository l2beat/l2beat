import express from 'express'
import type { RenderFunction } from 'rewrite/src/ssr/types'
import { validateRoute } from 'rewrite/src/utils/validateRoute'
import { z } from 'zod'
import type { Manifest } from '~/utils/Manifest'
import { getBridgesArchivedData } from './archived/getBridgesArchivedData'
import { getBridgesProjectData } from './project/getBridgesProjectData'
import { getBridgesSummaryData } from './summary/getBridgesSummaryData'

export function createBridgesRouter(
  manifest: Manifest,
  render: RenderFunction,
) {
  const router = express.Router()

  router.get('/', async (req, res) => {
    res.redirect('/bridges/summary')
  })

  router.get('/summary', async (req, res) => {
    const data = await getBridgesSummaryData(manifest, req.originalUrl)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/archived', async (req, res) => {
    const data = await getBridgesArchivedData(manifest, req.originalUrl)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/projects/:slug',
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
      res.status(200).send(html)
    },
  )

  return router
}
