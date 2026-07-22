import type { InMemoryCache } from '@l2beat/shared-pure'
import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getHomeData } from './getHomeData'

export function createHomeRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  router.get('/', async (req, res) => {
    const data = await getHomeData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    // no-cache so clients that cached the old "/" redirect (301, later 307)
    // always revalidate and pick up this page instead. Keep until the
    // cached-301 population has decayed (see PR #12329); if relaxed later,
    // never serve "/" without an explicit Cache-Control again.
    res.set('Cache-Control', 'no-cache')
    res.status(200).send(html)
  })

  return router
}
