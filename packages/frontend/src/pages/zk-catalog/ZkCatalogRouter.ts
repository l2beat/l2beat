import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express, { type Request } from 'express'
import {
  serveMarkdown,
  serveMarkdownIfPreferred,
} from '~/server/markdown/markdownAlternate'
import type { RenderFunction } from '~/ssr/types'
import { validateRoute } from '~/utils/validateRoute'
import type { Manifest } from '../../utils/Manifest'
import { sendNotFoundPage } from '../not-found/sendNotFoundPage'
import { getZkCatalogData } from './v2/getZkCatalogData'
import {
  getZkCatalogProjectData,
  getZkCatalogProjectMarkdown,
} from './v2/project/getZkCatalogProjectData'

export function createZkCatalogRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  router.get('/zk-catalog', async (req, res) => {
    const data = await getZkCatalogData(manifest, req.originalUrl, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  const getProjectMarkdown = (req: Request<{ slug: string }>) =>
    getZkCatalogProjectMarkdown(manifest, req.params.slug, cache)

  // Before `:slug`, which would otherwise take "sp1turbo.md" as the slug.
  router.get(
    '/zk-catalog/:slug.md',
    validateRoute({ params: v.object({ slug: v.string() }) }),
    serveMarkdown(getProjectMarkdown),
  )

  router.get(
    '/zk-catalog/:slug',
    validateRoute({
      params: v.object({ slug: v.string() }),
    }),
    serveMarkdownIfPreferred(getProjectMarkdown),
    async (req, res) => {
      const data = await getZkCatalogProjectData(
        manifest,
        req.params.slug,
        cache,
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
