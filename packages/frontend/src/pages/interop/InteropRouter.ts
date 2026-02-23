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

export type SelectedChainsQuery = v.infer<typeof SelectedChainsQuerySchema>
const SelectedChainsQuerySchema = v.object({
  selectedChains: v
    .string()
    .optional()
    .transform((v) => v?.split(',')),
})

export type InternalFromToQuery = v.infer<typeof InternalFromToQuerySchema>
const InternalFromToQuerySchema = v.object({
  from: v
    .string()
    .optional()
    .transform((v) => v?.split(',')),
  to: v
    .string()
    .optional()
    .transform((v) => v?.split(',')),
})

export function createInteropRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: ICache,
) {
  const router = express.Router()

  router.get('/interop', (_req, res) => {
    res.redirect('/interop/summary')
  })

  router.get('/interop/internal', (_req, res) => {
    res.redirect('/interop/internal/summary')
  })

  router.get(
    '/interop/summary',
    validateRoute({
      query: SelectedChainsQuerySchema,
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
      query: SelectedChainsQuerySchema,
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
      query: SelectedChainsQuerySchema,
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
      query: SelectedChainsQuerySchema,
    }),
    async (req, res) => {
      const data = await getInteropBurnAndMintData(req, manifest, cache)
      const html = render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  router.get(
    '/interop/internal/summary',
    validateRoute({
      query: InternalFromToQuerySchema,
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
    '/interop/internal/non-minting',
    validateRoute({
      query: InternalFromToQuerySchema,
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
    '/interop/internal/lock-and-mint',
    validateRoute({
      query: InternalFromToQuerySchema,
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
    '/interop/internal/burn-and-mint',
    validateRoute({
      query: InternalFromToQuerySchema,
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
