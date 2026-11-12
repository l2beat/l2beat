import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express'
import {
  serveMarkdown,
  serveMarkdownIfPreferred,
} from '~/server/markdown/markdownAlternate'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { validateRoute } from '~/utils/validateRoute'
import { sendNotFoundPage } from '../not-found/sendNotFoundPage'
import { getPrivacyArchivedData } from './archived/getPrivacyArchivedData'
import {
  getPrivacyFirstChainPath,
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

  router.get('/privacy/archived', async (req, res) => {
    const data = await getPrivacyArchivedData(manifest, req.originalUrl, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  // A project tracked on several chains has a page per chain: its first
  // chain at the project's URL, the others at `{project}/{chain}`.
  const projectParams = v.object({
    slug: v.string(),
    chain: v.string().optional(),
  })
  const getProjectMarkdown = (req: Request<v.infer<typeof projectParams>>) =>
    getPrivacyProjectMarkdown(
      manifest,
      req.params.slug,
      req.params.chain,
      cache,
    )
  // Whatever the request prefers: markdown has the same one URL per page.
  const redirectFirstChain =
    (extension: '' | '.md') =>
    async (
      req: Request<v.infer<typeof projectParams>>,
      res: Response,
      next: NextFunction,
    ) => {
      const path = await getPrivacyFirstChainPath(
        req.params.slug,
        req.params.chain,
      )
      if (path === undefined) {
        next()
        return
      }
      res.redirect(301, `${path}${extension}`)
    }

  // Before the page route, which would otherwise take "tornado-cash.md" as the slug.
  router.get(
    '/privacy/projects/:slug{/:chain}.md',
    validateRoute({ params: projectParams }),
    redirectFirstChain('.md'),
    serveMarkdown(getProjectMarkdown),
  )

  router.get(
    '/privacy/projects/:slug{/:chain}',
    validateRoute({
      params: projectParams,
      query: v.object({ update: v.string().optional() }),
    }),
    redirectFirstChain(''),
    serveMarkdownIfPreferred(getProjectMarkdown),
    async (req, res) => {
      const data = await getPrivacyProjectData(
        manifest,
        req.params.slug,
        req.params.chain,
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
