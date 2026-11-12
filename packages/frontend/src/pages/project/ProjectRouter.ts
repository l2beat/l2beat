import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express, { type Request, type Response } from 'express'
import {
  getProjectPage,
  type ProjectPageSection,
} from '~/server/features/projects/getProjectPage'
import {
  LLMS_TXT_LINK,
  serveMarkdown,
  serveMarkdownIfPreferred,
} from '~/server/markdown/markdownAlternate'
import type { RenderData, RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getProjectPath } from '~/utils/project/getProjectPath'
import { validateRoute } from '~/utils/validateRoute'
import { getChainProjectData } from '../chain/getChainProjectData'
import {
  getDefiProjectData,
  getDefiProjectMarkdown,
} from '../defi/project/getDefiProjectData'
import {
  getEthereumProjectData,
  getEthereumProjectMarkdown,
} from '../ethereum/getEthereumProjectData'
import {
  getInteropProtocolMarkdown,
  getInteropProtocolPageData,
} from '../interop/protocol/getInteropProtocolPageData'
import {
  getL2ProjectData,
  getL2ProjectMarkdown,
} from '../layer2s/project/getL2ProjectData'
import { getL2ProjectTvsBreakdownData } from '../layer2s/project/tvs-breakdown/getL2ProjectTvsBreakdownData'
import { sendNotFoundPage } from '../not-found/sendNotFoundPage'
import {
  getPrivacyProjectData,
  getPrivacyProjectMarkdown,
} from '../privacy/project/getPrivacyProjectData'
import {
  getZkCatalogProjectData,
  getZkCatalogProjectMarkdown,
} from '../zk-catalog/v2/project/getZkCatalogProjectData'

type PageRequest = Request<
  { slug: string },
  unknown,
  unknown,
  { update?: string }
>

/**
 * Every project's page, at `/projects/{slug}`. The sections the project is in
 * pick the page builder; the builder merges in the other sections' content.
 */
export function createProjectRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  const html: Record<
    ProjectPageSection,
    (req: PageRequest) => Promise<RenderData | undefined>
  > = {
    ethereum: () => getEthereumProjectData(manifest, cache),
    layer2s: (req) => getL2ProjectData(req, manifest, cache),
    interop: (req) => getInteropProtocolPageData(req, manifest, cache),
    chain: (req) => getChainProjectData(manifest, req.params.slug, cache),
    zkCatalog: (req) =>
      getZkCatalogProjectData(manifest, req.params.slug, cache),
    privacy: (req) =>
      getPrivacyProjectData(manifest, req.params.slug, cache, req.query.update),
    defi: (req) =>
      getDefiProjectData(req.params.slug, manifest, cache, req.query.update),
  }

  const markdown: Record<
    ProjectPageSection,
    ((slug: string) => Promise<string | undefined>) | undefined
  > = {
    ethereum: () => getEthereumProjectMarkdown(manifest, cache),
    layer2s: (slug) => getL2ProjectMarkdown(slug, manifest, cache),
    interop: (slug) => getInteropProtocolMarkdown(slug, manifest, cache),
    // Chain pages show only interop flows, which have no markdown version.
    chain: undefined,
    zkCatalog: (slug) => getZkCatalogProjectMarkdown(manifest, slug, cache),
    privacy: (slug) => getPrivacyProjectMarkdown(manifest, slug, cache),
    defi: (slug) => getDefiProjectMarkdown(slug, manifest, cache),
  }

  const getMarkdown = async (req: Request<{ slug: string }>) => {
    const page = await getProjectPage(req.params.slug)
    return page && markdown[page]?.(req.params.slug)
  }

  const negotiateMarkdown = serveMarkdownIfPreferred(getMarkdown)

  // Before `:slug`, which would otherwise take "arbitrum.md" as the slug.
  router.get(
    '/projects/:slug.md',
    validateRoute({ params: v.object({ slug: v.string() }) }),
    serveMarkdown(getMarkdown),
  )

  router.get(
    '/projects/:slug',
    validateRoute({
      params: v.object({ slug: v.string() }),
      query: v.object({ update: v.string().optional() }),
    }),
    async (req, res, next) => {
      const page = await getProjectPage(req.params.slug)
      res.locals.page = page
      if (page && !markdown[page]) {
        // No markdown version: HTML for every Accept, and no alternate.
        res.setHeader('Link', LLMS_TXT_LINK)
        next()
        return
      }
      await negotiateMarkdown(req, res, next)
    },
    // A handler of its own, so Express catches what rendering throws.
    async (req, res) => {
      const page: ProjectPageSection | undefined = res.locals.page
      await send(res, req.originalUrl, page && (await html[page](req)))
    },
  )

  router.get(
    '/projects/:slug/tvs-breakdown',
    validateRoute({ params: v.object({ slug: v.string() }) }),
    async (req, res) => {
      const { slug } = req.params
      const data = await cache.get(
        {
          key: ['projects', slug, 'tvs-breakdown'],
          ttl: 5 * 60,
          staleWhileRevalidate: 25 * 60,
        },
        () =>
          getL2ProjectTvsBreakdownData(
            manifest,
            slug,
            `${getProjectPath(slug)}/tvs-breakdown`,
          ),
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
