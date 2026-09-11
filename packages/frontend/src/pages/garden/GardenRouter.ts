import type { InMemoryCache } from '@l2beat/shared-pure'
import express from 'express'
import { env } from '~/env'
import type { RenderData, RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getGardenData } from './getGardenData'
import { getIntegrateCropsData } from './integrate/getIntegrateCropsData'
import {
  GARDEN_PATH,
  INTEGRATE_CROPS_PATH,
  SUBMIT_PROTOCOL_PATH,
} from './paths'
import { getSubmitProtocolData } from './submit/getSubmitProtocolData'

export function createGardenRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  if (!env.CLIENT_SIDE_GARDEN_ENABLED) {
    return null
  }

  const router = express.Router()

  /** The garden and its docs read the database and the TVS breakdown, so they are cached like the other data-backed pages. */
  const cached = (url: string, load: () => Promise<RenderData>) =>
    cache.get(
      { key: ['garden', url], ttl: 5 * 60, staleWhileRevalidate: 25 * 60 },
      load,
    )

  router.get(GARDEN_PATH, async (req, res) => {
    const data = await cached(req.originalUrl, () =>
      getGardenData(manifest, req.originalUrl),
    )
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(SUBMIT_PROTOCOL_PATH, async (req, res) => {
    const data = await getSubmitProtocolData(manifest, req.originalUrl)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(INTEGRATE_CROPS_PATH, async (req, res) => {
    const data = await cached(req.originalUrl, () =>
      getIntegrateCropsData(manifest, req.originalUrl),
    )
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}
