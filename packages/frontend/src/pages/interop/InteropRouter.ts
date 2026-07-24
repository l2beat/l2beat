import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express from 'express'
import { ps } from '~/server/projects'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { validateRoute } from '~/utils/validateRoute'
import { getInteropBurnAndMintData } from './burn-and-mint/getInteropBurnAndMintData'
import { getInteropIntentBridgesData } from './intent-bridges/getInteropIntentBridgesData'
import { getInteropLockAndMintData } from './lock-and-mint/getInteropLockAndMintData'
import { getInteropNonMintingData } from './non-minting/getInteropNonMintingData'
import { getInteropProtocolPageData } from './protocol/getInteropProtocolPageData'
import { getInteropSummaryData } from './summary/getInteropSummaryData'
import { getInteropTokenPageData } from './token/getInteropTokenPageData'
import { getInteropTokenFrameworksData } from './token-frameworks/getInteropTokenFrameworksData'

export type InteropQuery = v.infer<typeof InteropQuery>
const InteropQuery = v
  .object({
    from: v
      .string()
      .transform((v) => v?.split(','))
      .optional(),
    to: v
      .string()
      .transform((v) => v?.split(','))
      .optional(),
  })
  .optional()

export function createInteropRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  router.get('/interop', (_req, res) => {
    res.redirect(301, '/interop/summary')
  })

  router.get(
    '/interop/summary',
    validateRoute({
      query: InteropQuery,
    }),
    async (req, res) => {
      const data = await getInteropSummaryData(req, manifest, cache)
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  router.get(
    '/interop/non-minting',
    validateRoute({
      query: InteropQuery,
    }),
    async (req, res) => {
      const data = await getInteropNonMintingData(req, manifest, cache)
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  router.get(
    '/interop/lock-and-mint',
    validateRoute({
      query: InteropQuery,
    }),
    async (req, res) => {
      const data = await getInteropLockAndMintData(req, manifest, cache)
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  router.get(
    '/interop/burn-and-mint',
    validateRoute({
      query: InteropQuery,
    }),
    async (req, res) => {
      const data = await getInteropBurnAndMintData(req, manifest, cache)
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  router.get('/interop/token-frameworks', async (req, res) => {
    const data = await getInteropTokenFrameworksData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/interop/intent-bridges', async (req, res) => {
    const data = await getInteropIntentBridgesData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/interop/protocols/:slug',
    validateRoute({
      params: v.object({ slug: v.string() }),
      query: v.object({ update: v.string().optional() }),
    }),
    async (req, res) => {
      const project = await ps.getProject({
        slug: req.params.slug,
        optional: ['scalingInfo', 'interopConfig'],
      })
      if (project?.scalingInfo && project.interopConfig) {
        res.redirect(
          302,
          `/scaling/projects/${project.slug}?protocols=${project.id}#interop-flows`,
        )
        return
      }

      const data = await getInteropProtocolPageData(req, manifest, cache)
      if (!data) {
        res.status(404).send('Not found')
        return
      }
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  router.get(
    '/interop/tokens/:slug',
    validateRoute({
      params: v.object({ slug: v.string() }),
      query: InteropQuery,
    }),
    async (req, res) => {
      const data = await getInteropTokenPageData(req, manifest, cache)
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
