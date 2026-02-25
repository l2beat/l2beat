import { v } from '@l2beat/validate'
import express from 'express'
import type { ICache } from '~/server/cache/ICache'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { validateRoute } from '~/utils/validateRoute'
import { getInteropBurnAndMintData } from './burn-and-mint/getInteropBurnAndMintData'
import { getInteropLockAndMintData } from './lock-and-mint/getInteropLockAndMintData'
import { getInteropNonMintingData } from './non-minting/getInteropNonMintingData'
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
  cache: ICache,
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
      const html = render(data, req.originalUrl)
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
      const html = render(data, req.originalUrl)
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
      const html = render(data, req.originalUrl)
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
      const html = render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  router.get(
    '/interop/summary/internal',
    validateRoute({
      query: InteropQuery,
    }),
    async (req, res) => {
      const data = await getInteropSummaryData(req, manifest, cache, {
        mode: 'internal',
      })
      const html = render(data, req.originalUrl)
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
      const html = render(data, req.originalUrl)
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
      const html = render(data, req.originalUrl)
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
      const html = render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  return router
}
