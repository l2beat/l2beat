import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express, { type Response } from 'express'
import {
  getProjectPage,
  hasMarkdown,
  type ProjectPage,
  type ProjectPageSection,
  type ProjectPageWithMarkdown,
} from '~/server/features/projects/getProjectPage'
import {
  LLMS_TXT_LINK,
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

/**
 * Every project's page, at `/projects/{slug}`. The sections the project is in
 * pick the page builder, which lists what each of them adds to the page.
 */
export function createProjectRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  type Html = (
    page: ProjectPage,
    manifest: Manifest,
    cache: InMemoryCache,
    selectedUpdateId?: string,
  ) => Promise<RenderData | undefined>
  const html: Record<ProjectPageSection, Html> = {
    ethereum: (_, manifest, cache) => getEthereumProjectData(manifest, cache),
    layer2s: getL2ProjectData,
    interop: getInteropProtocolPageData,
    chain: getChainProjectData,
    zkCatalog: getZkCatalogProjectData,
    privacy: getPrivacyProjectData,
    defi: getDefiProjectData,
  }

  type Markdown = (
    page: ProjectPage,
    manifest: Manifest,
    cache: InMemoryCache,
  ) => Promise<string | undefined>
  const markdown: Record<ProjectPageWithMarkdown['kind'], Markdown> = {
    ethereum: (_, manifest, cache) =>
      getEthereumProjectMarkdown(manifest, cache),
    layer2s: getL2ProjectMarkdown,
    interop: getInteropProtocolMarkdown,
    zkCatalog: getZkCatalogProjectMarkdown,
    privacy: getPrivacyProjectMarkdown,
    defi: getDefiProjectMarkdown,
  }

  const getMarkdown = async (page: ProjectPage | undefined) =>
    page && hasMarkdown(page)
      ? markdown[page.kind](page, manifest, cache)
      : undefined

  // Before `:slug`, which would otherwise take "arbitrum.md" as the slug.
  router.get(
    `${getProjectPath(':slug')}.md`,
    validateRoute({ params: v.object({ slug: v.string() }) }),
    serveMarkdown(async (req) =>
      getMarkdown(await getProjectPage(req.params.slug)),
    ),
  )

  router.get(
    getProjectPath(':slug'),
    validateRoute({
      params: v.object({ slug: v.string() }),
      query: v.object({ update: v.string().optional() }),
    }),
    async (req, res, next) => {
      const page = await getProjectPage(req.params.slug)
      res.locals.page = page
      if (page && !hasMarkdown(page)) {
        // HTML for every Accept, and without the `.md` alternate that
        // LlmsLinkHeaderMiddleware derived from the URL.
        res.setHeader('Link', LLMS_TXT_LINK)
        next()
        return
      }
      await serveMarkdownIfPreferred(() => getMarkdown(page))(req, res, next)
    },
    // A handler of its own, so Express catches what rendering throws.
    async (req, res) => {
      const page: ProjectPage | undefined = res.locals.page
      await send(
        res,
        req.originalUrl,
        page &&
          (await html[page.kind](page, manifest, cache, req.query.update)),
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
