import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { validateRoute } from '~/utils/validateRoute'
import { getPrivacyProjectData } from './project/getPrivacyProjectData'
import { getPrivacySummaryData } from './summary/getPrivacySummaryData'

export function createPrivacyRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  router.get('/privacy', (_req, res) => {
    res.redirect(301, '/privacy/summary')
  })

  router.get('/privacy/summary', async (req, res) => {
    const data = await cache.get(
      {
        key: ['privacy', 'summary', req.originalUrl],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getPrivacySummaryData(manifest, req.originalUrl, cache),
    )
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/privacy/projects/:slug',
    validateRoute({
      params: v.object({ slug: v.string() }),
    }),
    async (req, res) => {
      const data = await cache.get(
        {
          key: ['privacy', 'projects', req.params.slug],
          ttl: 5 * 60,
          staleWhileRevalidate: 25 * 60,
        },
        () => getPrivacyProjectData(manifest, req.params.slug, req.originalUrl),
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
