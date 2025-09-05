import { v } from '@l2beat/validate'
import express from 'express'
import type { ICache } from '~/server/cache/ICache'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { validateRoute } from '~/utils/validateRoute'
import { getDataAvailabilityArchivedData } from './archived/getDataAvailabilityArchivedData'
import { getDataAvailabilityLivenessData } from './liveness/getDataAvailabilityLivenessData'
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

  router.get('/data-availability', (_req, res) => {
    res.redirect('/data-availability/summary')
  })

  router.get('/data-availability/summary', async (req, res) => {
    const data = await cache.get(
      {
        key: ['data-availability', 'summary'],
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
        key: ['data-availability', 'risk'],
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
        key: ['data-availability', 'throughput'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getDataAvailabilityThroughputData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/data-availability/liveness', async (req, res) => {
    const data = await cache.get(
      {
        key: ['data-availability', 'liveness'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getDataAvailabilityLivenessData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/data-availability/archived', async (req, res) => {
    const data = await cache.get(
      {
        key: ['data-availability', 'archived'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getDataAvailabilityArchivedData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/data-availability/projects/:layer/:bridge',
    validateRoute({
      params: v.object({ layer: v.string(), bridge: v.string() }),
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
