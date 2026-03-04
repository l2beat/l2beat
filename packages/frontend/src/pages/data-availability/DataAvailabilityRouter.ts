import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express from 'express'
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
  cache: InMemoryCache,
) {
  const router = express.Router()

  router.get('/data-availability', (_req, res) => {
    res.redirect('/data-availability/summary')
  })

  router.get('/data-availability/summary', async (req, res) => {
    const data = await getDataAvailabilitySummaryData(req, manifest, cache)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/data-availability/risk', async (req, res) => {
    const data = await getDataAvailabilityRiskData(req, manifest, cache)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/data-availability/throughput', async (req, res) => {
    const data = await getDataAvailabilityThroughputData(req, manifest, cache)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/data-availability/liveness', async (req, res) => {
    const data = await getDataAvailabilityLivenessData(req, manifest, cache)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/data-availability/archived', async (req, res) => {
    const data = await getDataAvailabilityArchivedData(req, manifest, cache)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/data-availability/projects/:layer/:bridge',
    validateRoute({
      params: v.object({ layer: v.string(), bridge: v.string() }),
    }),
    async (req, res) => {
      const data = await getDataAvailabilityProjectData(req, manifest, cache)

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
