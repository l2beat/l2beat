import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express, { type Request } from 'express'
import { env } from '~/env'
import {
  serveMarkdown,
  serveMarkdownIfPreferred,
} from '~/server/markdown/markdownAlternate'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { validateRoute } from '~/utils/validateRoute'
import { sendNotFoundPage } from '../not-found/sendNotFoundPage'
import {
  getDefiProjectData,
  getDefiProjectMarkdown,
} from './project/getDefiProjectData'
import { getDefiSummaryData } from './summary/getDefiSummaryData'

export function createDefiRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  if (!env.CLIENT_SIDE_DEFI_ENABLED) {
    return null
  }

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
      () => getDefiSummaryData(manifest, req.originalUrl, cache),
    )
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  const getProjectMarkdown = (req: Request<{ slug: string }>) =>
    getDefiProjectMarkdown(req.params.slug, manifest, cache)

  // Before `:slug`, which would otherwise take "aave.md" as the slug.
  router.get(
    '/defi/projects/:slug.md',
    validateRoute({ params: v.object({ slug: v.string() }) }),
    serveMarkdown(getProjectMarkdown),
  )

  router.get(
    '/defi/projects/:slug',
    validateRoute({
      params: v.object({ slug: v.string() }),
    }),
    serveMarkdownIfPreferred(getProjectMarkdown),
    async (req, res) => {
      const data = await getDefiProjectData(req.params.slug, manifest, cache)

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
