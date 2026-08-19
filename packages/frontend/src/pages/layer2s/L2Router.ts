import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { validateRoute } from '~/utils/validateRoute'
import { getL2ActivityData } from './activity/getL2ActivityData'
import { getL2ArchivedData } from './archived/getL2ArchivedData'
import { getL2CostsData } from './costs/getL2CostsData'
import { getL2LivenessData } from './liveness/getL2LivenessData'
import { getL2ProjectData } from './project/getL2ProjectData'
import { getL2ProjectTvsBreakdownData } from './project/tvs-breakdown/getL2ProjectTvsBreakdownData'
import { getL2RiskDataAvailabilityData } from './risk/data-availability/getL2RiskDataAvailabilityData'
import { getL2RiskData } from './risk/getL2RiskData'
import { getL2RiskSequencingData } from './risk/sequencing/getL2RiskSequencingData'
import { getL2RiskStateValidationData } from './risk/state-validation/getL2RiskStateValidationData'
import { getL2SummaryData } from './summary/getL2SummaryData'
import { getL2TvsBreakdownData } from './tvs/breakdown/getL2TvsBreakdownData'
import { getL2TvsData } from './tvs/getL2TvsData'
export function createL2Router(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  router.get('/layer2s', (_req, res) => {
    res.redirect(301, '/layer2s/summary')
  })

  router.get('/layer2s/summary', async (req, res) => {
    const data = await getL2SummaryData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/layer2s/activity', async (req, res) => {
    const data = await getL2ActivityData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/layer2s/risk', async (req, res) => {
    const data = await getL2RiskData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/layer2s/risk/state-validation', async (req, res) => {
    const data = await getL2RiskStateValidationData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/layer2s/risk/data-availability', async (req, res) => {
    const data = await getL2RiskDataAvailabilityData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/layer2s/risk/sequencing', async (req, res) => {
    const data = await getL2RiskSequencingData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/layer2s/tvs',
    validateRoute({
      query: v.object({
        tab: v
          .enum(['rollups', 'validiumsAndOptimiums', 'others'])
          .default('rollups'),
      }),
    }),
    async (req, res) => {
      const data = await getL2TvsData(req, manifest, cache)
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  router.get('/layer2s/tvs/breakdown', async (req, res) => {
    const data = await getL2TvsBreakdownData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/layer2s/liveness', async (req, res) => {
    const data = await getL2LivenessData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/layer2s/costs',
    validateRoute({
      query: v.object({
        tab: v.enum(['rollups', 'others']).default('rollups'),
      }),
    }),
    async (req, res) => {
      const data = await getL2CostsData(req, manifest, cache)
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  router.get('/layer2s/archived', async (req, res) => {
    const data = await getL2ArchivedData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/layer2s/projects/:slug',
    validateRoute({
      params: v.object({ slug: v.string() }),
      query: v.object({ update: v.string().optional() }),
    }),
    async (req, res) => {
      const data = await getL2ProjectData(req, manifest, cache)
      if (!data) {
        res.status(404).send('Not found')
        return
      }
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  router.get(
    '/layer2s/projects/:slug/tvs-breakdown',
    validateRoute({
      params: v.object({ slug: v.string() }),
    }),
    async (req, res) => {
      const data = await cache.get(
        {
          key: ['layer2s', 'projects', req.params.slug, 'tvs-breakdown'],
          ttl: 5 * 60,
          staleWhileRevalidate: 25 * 60,
        },
        () =>
          getL2ProjectTvsBreakdownData(
            manifest,
            req.params.slug,
            req.originalUrl,
          ),
      )
      if (!data) {
        res.status(404).send('Not found')
        return
      }
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  return router
}
