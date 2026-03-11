import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express from 'express'
import { env } from '~/env'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { validateRoute } from '~/utils/validateRoute'
import { getInteropBurnAndMintData } from './burn-and-mint/getInteropBurnAndMintData'
import { getInteropLockAndMintData } from './lock-and-mint/getInteropLockAndMintData'
import { getInteropNonMintingData } from './non-minting/getInteropNonMintingData'
import { getInteropProtocolPageData } from './protocol/getInteropProtocolPageData'
import { getInteropSummaryData } from './summary/getInteropSummaryData'

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
    selectedChains: v
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
    res.redirect('/interop/summary')
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

  if (env.CLIENT_SIDE_INTEROP_DETAILED_PAGES) {
    router.get(
      '/interop/protocols/:slug',
      validateRoute({
        params: v.object({ slug: v.string() }),
        query: InteropQuery,
      }),
      async (req, res) => {
        const data = await getInteropProtocolPageData(req, manifest)
        if (!data) {
          res.status(404).send('Not found')
          return
        }
        const html = await render(data, req.originalUrl)
        res.status(200).send(html)
      },
    )

    router.get(
      '/interop/protocols/:slug/internal',
      validateRoute({
        params: v.object({ slug: v.string() }),
        query: InteropQuery,
      }),
      async (req, res) => {
        const data = await getInteropProtocolPageData(req, manifest, 'internal')
        if (!data) {
          res.status(404).send('Not found')
          return
        }
        const html = await render(data, req.originalUrl)
        res.status(200).send(html)
      },
    )
  }

  router.get(
    '/interop/summary/internal',
    validateRoute({
      query: InteropQuery,
    }),
    async (req, res) => {
      const data = await getInteropSummaryData(req, manifest, cache, {
        mode: 'internal',
      })
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  router.get(
    '/interop/non-minting/internal',
    validateRoute({
      query: InteropQuery,
    }),
    async (req, res) => {
      const data = await getInteropNonMintingData(req, manifest, cache, {
        mode: 'internal',
      })
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  router.get(
    '/interop/lock-and-mint/internal',
    validateRoute({
      query: InteropQuery,
    }),
    async (req, res) => {
      const data = await getInteropLockAndMintData(req, manifest, cache, {
        mode: 'internal',
      })
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  router.get(
    '/interop/burn-and-mint/internal',
    validateRoute({
      query: InteropQuery,
    }),
    async (req, res) => {
      const data = await getInteropBurnAndMintData(req, manifest, cache, {
        mode: 'internal',
      })
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  return router
}
