import express from 'express'
import type { ICache } from '~/server/cache/ICache'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getInteropNonMintingData } from './non-minting/getInteropNonMintingData'
import { getInteropSummaryData } from './summary/getInteropSummaryData'

export function createInteropRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: ICache,
) {
  const router = express.Router()

  router.get('/interop', (_req, res) => {
    res.redirect('/interop/summary')
  })

  router.get('/interop/summary', async (req, res) => {
    const data = await getInteropSummaryData(req, manifest, cache)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/interop/non-minting', async (req, res) => {
    const data = await getInteropNonMintingData(req, manifest, cache)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}
