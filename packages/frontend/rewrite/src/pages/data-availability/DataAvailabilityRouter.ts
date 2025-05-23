import express from 'express'
import type { ICache } from 'rewrite/src/server/cache/ICache'
import type { RenderFunction } from 'rewrite/src/ssr/types'
import { validateRoute } from 'rewrite/src/utils/validateRoute'
import { z } from 'zod'
import type { Manifest } from '~/utils/Manifest'
import { getDataAvailabilityProjectData } from './project/getDataAvailabilityProjectData'
import { getDataAvailabilityRiskData } from './risk/getDataAvailabilityRiskData'
import { getDataAvailabilitySummaryData } from './summary/getDataAvailabilitySummaryData'
import { getDataAvailabilityThroughputData } from './throughput/getDataAvailabilityThroughputData'

export function createDataAvailabilityRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: ICache,
) {
  const router = express.Router()

  router.get('/data-availability', async (_, res) => {
    res.redirect('/data-availability/summary')
  })

  router.get('/data-availability/summary', async (req, res) => {
    const data = await cache.get(
      { key: ['data-availability', 'summary'], ttl: 10 * 60 },
      () => getDataAvailabilitySummaryData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/data-availability/risk', async (req, res) => {
    const data = await cache.get(
      { key: ['data-availability', 'risk'], ttl: 10 * 60 },
      () => getDataAvailabilityRiskData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/data-availability/throughput', async (req, res) => {
    const data = await cache.get(
      { key: ['data-availability', 'throughput'], ttl: 10 * 60 },
      () => getDataAvailabilityThroughputData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/data-availability/projects/:layer/:bridge',
    validateRoute({
      params: z.object({
        layer: z.string(),
        bridge: z.string(),
      }),
    }),
    async (req, res) => {
      const data = await cache.get(
        {
          key: [
            'data-availability',
            'projects',
            req.params.layer,
            req.params.bridge,
          ],
          ttl: 10 * 60,
        },
        () =>
          getDataAvailabilityProjectData(manifest, req.params, req.originalUrl),
      )
      if (!data) {
        res.status(404).send('Not found')
        return
      }
      const html = render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  return router
}
