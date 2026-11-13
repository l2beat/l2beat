import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express, { type Request, type Response } from 'express'
import { getProjectPage } from '~/server/features/projects/getProjectPage'
import {
  serveMarkdown,
  serveMarkdownIfPreferred,
} from '~/server/markdown/markdownAlternate'
import type { RenderData, RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import {
  getProjectPath,
  getProjectTvsBreakdownPath,
} from '~/utils/project/getProjectPath'
import { validateRoute } from '~/utils/validateRoute'
import { getL2ProjectTvsBreakdownData } from '../layer2s/project/tvs-breakdown/getL2ProjectTvsBreakdownData'
import { sendNotFoundPage } from '../not-found/sendNotFoundPage'
import { getProjectData, getProjectMarkdown } from './getProjectData'

/**
 * Every project's page, at `/projects/{slug}`. The sections the project is in
 * pick the kind of page it gets.
 */
export function createProjectRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  const getMarkdown = async (req: Request<{ slug: string }>) => {
    const page = await getProjectPage(req.params.slug)
    return page && getProjectMarkdown(page, manifest, cache)
  }

  // Before `:slug`, which would otherwise take "arbitrum.md" as the slug.
  router.get(
    `${getProjectPath(':slug')}.md`,
    validateRoute({ params: v.object({ slug: v.string() }) }),
    serveMarkdown(getMarkdown),
  )

  router.get(
    getProjectPath(':slug'),
    validateRoute({
      params: v.object({ slug: v.string() }),
      query: v.object({ update: v.string().optional() }),
    }),
    serveMarkdownIfPreferred(getMarkdown),
    async (req, res) => {
      const page = await getProjectPage(req.params.slug)
      await send(
        res,
        req.originalUrl,
        page && (await getProjectData(page, manifest, cache, req.query.update)),
      )
    },
  )

  router.get(
    getProjectTvsBreakdownPath(':slug'),
    validateRoute({ params: v.object({ slug: v.string() }) }),
    async (req, res) => {
      const { slug } = req.params
      const data = await cache.get(
        {
          key: ['projects', slug, 'tvs-breakdown'],
          ttl: 5 * 60,
          staleWhileRevalidate: 25 * 60,
        },
        () => getL2ProjectTvsBreakdownData(manifest, slug),
      )
      await send(res, req.originalUrl, data)
    },
  )

  async function send(
    res: Response,
    url: string,
    data: RenderData | undefined,
  ) {
    if (!data) {
      await sendNotFoundPage(manifest, render, url, res)
      return
    }
    res.status(200).send(await render(data, url))
  }

  return router
}
