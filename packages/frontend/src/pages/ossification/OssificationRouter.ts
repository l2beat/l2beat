import type { InMemoryCache } from '@l2beat/shared-pure'
import express from 'express'
import { env } from '~/env'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getOssificationData } from './getOssificationData'

export function createOssificationRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  if (!env.CLIENT_SIDE_OSSIFICATION_ENABLED) {
    return null
  }

  const router = express.Router()

  router.get('/ossification', async (req, res) => {
    const data = await cache.get(
      {
        key: ['ossification', req.originalUrl],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getOssificationData(manifest, req.originalUrl, cache),
    )
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}
