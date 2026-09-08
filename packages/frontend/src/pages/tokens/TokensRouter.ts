import type { InMemoryCache } from '@l2beat/shared-pure'
import express from 'express'
import { env } from '~/env'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getTokensPageData } from './getTokensPageData'

export function createTokensRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  if (!env.CLIENT_SIDE_TOKENS_PAGE) return null
  const router = express.Router()

  router.get('/tokens', async (req, res) => {
    const data = await cache.get(
      {
        key: ['tokens', req.originalUrl],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getTokensPageData(manifest, req.originalUrl),
    )
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}
