import type { InMemoryCache } from '@l2beat/shared-pure'
import express from 'express'
import { env } from '~/env'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getGasFeesPageData } from './getGasFeesPageData'

export function createGasFeesRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  if (!env.CLIENT_SIDE_GAS_FEES_PAGE) return null
  const router = express.Router()

  router.get('/gas-fees', async (req, res) => {
    const data = await getGasFeesPageData(manifest, req.originalUrl, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}
