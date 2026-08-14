import type { InMemoryCache } from '@l2beat/shared-pure'
import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '../../utils/Manifest'
import { getTokensPageData } from './getTokensPageData'
import { getTokenLayoutLabPageData } from './lab/getTokenLayoutLabPageData'

export function createTokensRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  router.get('/tokens/lab', async (req, res) => {
    const data = await getTokenLayoutLabPageData(
      manifest,
      req.originalUrl,
      cache,
    )
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/tokens', async (req, res) => {
    const data = await getTokensPageData(manifest, req.originalUrl, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}
