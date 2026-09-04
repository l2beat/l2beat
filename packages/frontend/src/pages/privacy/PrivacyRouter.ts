import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express from 'express'
import { sendPage } from '~/server/utils/sendPage'
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
    sendPage(res, html)
  })

  router.get(
    '/privacy/projects/:slug',
    validateRoute({
      params: v.object({ slug: v.string() }),
      query: v.object({ update: v.string().optional() }),
    }),
    async (req, res) => {
      const data = await getPrivacyProjectData(
        manifest,
        req.params.slug,
        req.originalUrl,
        cache,
        req.query.update,
      )

      if (!data) {
        res.status(404).send('Not found')
        return
      }

      const html = await render(data, req.originalUrl)
      sendPage(res, html)
    },
  )

  return router
}
