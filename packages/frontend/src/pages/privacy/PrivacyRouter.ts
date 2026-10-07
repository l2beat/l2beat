import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express, { type Request } from 'express'
import {
  serveMarkdown,
  serveMarkdownIfPreferred,
} from '~/server/markdown/markdownAlternate'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { validateRoute } from '~/utils/validateRoute'
import { sendNotFoundPage } from '../not-found/sendNotFoundPage'
import {
  getPrivacyProjectData,
  getPrivacyProjectMarkdown,
} from './project/getPrivacyProjectData'
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

  const getProjectMarkdown = (req: Request<{ slug: string }>) =>
    getPrivacyProjectMarkdown(manifest, req.params.slug, cache)

  // Before `:slug`, which would otherwise take "tornado-cash.md" as the slug.
  router.get(
    '/privacy/projects/:slug.md',
    validateRoute({ params: v.object({ slug: v.string() }) }),
    serveMarkdown(getProjectMarkdown),
  )

  router.get(
    '/privacy/projects/:slug',
    validateRoute({
      params: v.object({ slug: v.string() }),
      query: v.object({ update: v.string().optional() }),
    }),
    serveMarkdownIfPreferred(getProjectMarkdown),
    async (req, res) => {
      const data = await getPrivacyProjectData(
        manifest,
        req.params.slug,
        cache,
        req.query.update,
      )

      if (!data) {
        await sendNotFoundPage(manifest, render, req.originalUrl, res)
        return
      }

      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  return router
}
