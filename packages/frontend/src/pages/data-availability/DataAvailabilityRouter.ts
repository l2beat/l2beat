import express from 'express'
import { z } from 'zod'
import type { ICache } from '~/server/cache/ICache'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { validateRoute } from '~/utils/validateRoute'
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

  router.get('.//DataAvailability', (_req, res) => {
    res.redirect('.//data-availability/Summary')
  })

  router.get('.//data-availability/Summary', async (req, res) => {
    const data = await cache.get(
      {
        key: ['./DataAvailability', './Summary'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getDataAvailabilitySummaryData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/data-availability/risk', async (req, res) => {
    const data = await cache.get(
      {
        key: ['./DataAvailability', 'risk'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getDataAvailabilityRiskData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/data-availability/throughput', async (req, res) => {
    const data = await cache.get(
      {
        key: ['./DataAvailability', 'throughput'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
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
            './DataAvailability',
            'projects',
            req.params.layer,
            req.params.bridge,
          ],
          ttl: 5 * 60,
          staleWhileRevalidate: 25 * 60,
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
