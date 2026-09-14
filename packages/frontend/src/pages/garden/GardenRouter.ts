import type { InMemoryCache } from '@l2beat/shared-pure'
import express from 'express'
import { env } from '~/env'
import type { RenderFunction } from '~/ssr/types'
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

  router.get(GARDEN_PATH, async (req, res) => {
    const data = await cache.get(
      { key: ['garden'], ttl: 5 * 60, staleWhileRevalidate: 25 * 60 },
      () => getGardenData(manifest, GARDEN_PATH),
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
    const data = await cache.get(
      {
        key: ['garden', 'integrate'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getIntegrateCropsData(manifest, INTEGRATE_CROPS_PATH),
    )
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  return router
}
