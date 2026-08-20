import type { InMemoryCache } from '@l2beat/shared-pure'
import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getSecurityData } from './getSecurityData'

export function createSecurityRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  router.get('/security', async (req, res) => {
    const data = await getSecurityData(manifest, req.originalUrl, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}
