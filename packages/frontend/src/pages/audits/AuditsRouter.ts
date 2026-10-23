import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { validateRoute } from '~/utils/validateRoute'
import { getAuditsProjectData } from './project/getAuditsProjectData'
import { getAuditsSummaryData } from './summary/getAuditsSummaryData'

export function createAuditsRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  router.get('/audits', (_req, res) => {
    res.redirect(301, '/audits/summary')
  })

  router.get('/audits/summary', async (req, res) => {
    const data = await cache.get(
      {
        key: ['audits', 'summary', req.originalUrl],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getAuditsSummaryData(manifest, req.originalUrl),
    )
    res.status(200).send(await render(data, req.originalUrl))
  })

  router.get(
    '/audits/projects/:slug',
    validateRoute({ params: v.object({ slug: v.string() }) }),
    async (req, res) => {
      const data = await cache.get(
        {
          key: ['audits', 'projects', req.params.slug],
          ttl: 5 * 60,
          staleWhileRevalidate: 25 * 60,
        },
        () => getAuditsProjectData(manifest, req.params.slug, req.originalUrl),
      )
      if (!data) {
        res.status(404).send('Not found')
        return
      }
      res.status(200).send(await render(data, req.originalUrl))
    },
  )

  return router
}
