import type { InMemoryCache } from '@l2beat/shared-pure'
import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getLandingData } from './getLandingData'

export function createLandingRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  router.get('/', async (req, res) => {
    const data = await getLandingData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}
