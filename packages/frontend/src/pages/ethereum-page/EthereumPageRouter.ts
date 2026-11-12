import type { InMemoryCache } from '@l2beat/shared-pure'
import express from 'express'
import { env } from '~/env'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getEthereumPageData } from './getEthereumPageData'

export function createEthereumPageRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  if (!env.CLIENT_SIDE_ETHEREUM_PAGE) return null
  const router = express.Router()

  router.get('/ethereum', async (req, res) => {
    const speed = req.query.speed === '3' ? 3 : 1
    const data = await cache.get(
      {
        key: ['ethereum-page', String(speed)],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getEthereumPageData(manifest, req.originalUrl, speed),
    )
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}
