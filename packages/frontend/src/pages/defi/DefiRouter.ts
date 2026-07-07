import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { validateRoute } from '~/utils/validateRoute'
import { getDefiProjectData } from './project/getDefiProjectData'
import { getDefiSummaryData } from './summary/getDefiSummaryData'

export function createDefiRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  router.get('/defi', (_req, res) => {
    res.redirect(301, '/defi/summary')
  })

  router.get('/defi/summary', async (req, res) => {
    const data = await cache.get(
      {
        key: ['defi', 'summary', req.originalUrl],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getDefiSummaryData(manifest, req.originalUrl),
    )
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/defi/projects/:slug',
    validateRoute({
      params: v.object({ slug: v.string() }),
    }),
    async (req, res) => {
      const data = await cache.get(
        {
          key: ['defi', 'projects', req.params.slug],
          ttl: 5 * 60,
          staleWhileRevalidate: 25 * 60,
        },
        () => getDefiProjectData(manifest, req.params.slug, req.originalUrl),
      )

      if (!data) {
        res.status(404).send('Not found')
        return
      }

      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  return router
}
