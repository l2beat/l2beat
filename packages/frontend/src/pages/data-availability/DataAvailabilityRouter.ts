import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { validateRoute } from '~/utils/validateRoute'
import { sendNotFoundPage } from '../not-found/sendNotFoundPage'
import { getDataAvailabilityProjectData } from './project/getDataAvailabilityProjectData'
import { getDataAvailabilitySummaryData } from './summary/getDataAvailabilitySummaryData'

export function createDataAvailabilityRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  // The section became Blobs and kept only its summary, so every page it
  // used to have sends to it
  router.get(
    [
      '/data-availability',
      '/data-availability/summary',
      '/data-availability/risk',
      '/data-availability/throughput',
      '/data-availability/liveness',
      '/data-availability/archived',
    ],
    (_req, res) => {
      res.redirect(301, '/blobs')
    },
  )
  router.get('/data-availability/summary.md', (_req, res) => {
    res.redirect(301, '/blobs.md')
  })

  router.get('/blobs', async (req, res) => {
    const data = await cache.get(
      {
        key: ['blobs'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getDataAvailabilitySummaryData(manifest, req.originalUrl),
    )
    const html = await render(data, req.originalUrl)
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
        await sendNotFoundPage(manifest, render, req.originalUrl, res)
        return
      }
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  return router
}
