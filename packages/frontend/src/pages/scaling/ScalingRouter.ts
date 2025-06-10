import express from 'express'
import { z } from 'zod'
import type { ICache } from '~/server/cache/ICache'
import { ScalingTab } from '~/server/features/scaling/getCommonScalingEntry'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { validateRoute } from '~/utils/validateRoute'
import { getScalingActivityData } from './activity/getScalingActivityData'
import { getScalingArchivedData } from './archived/getScalingArchivedData'
import { getScalingCostsData } from './costs/getScalingCostsData'
import { getScalingDataAvailabilityData } from './data-availability/getScalingDataAvailabilityData'
import { getScalingFinalityData } from './finality/getScalingFinalityData'
import { getScalingLivenessData } from './liveness/getScalingLivenessData'
import { getScalingProjectData } from './project/getScalingProjectData'
import { getScalingProjectTvsBreakdownData } from './project/tvs-breakdown/getScalingProjectTvsBreakdownData'
import { getScalingRiskData } from './risk/getScalingRiskData'
import { getScalingSummaryData } from './summary/getScalingSummaryData'
import { getScalingTvsData } from './tvs/getScalingTvsData'
import { getScalingUpcomingData } from './upcoming/getScalingUpcomingData'

export function createScalingRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: ICache,
) {
  const router = express.Router()

  router.get('/scaling', (_req, res) => {
    res.redirect('/scaling/summary')
  })

  router.get('/scaling/summary', async (req, res) => {
    const data = await getScalingSummaryData(req, manifest, cache)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/scaling/activity',
    validateRoute({
      query: z.object({
        tab: ScalingTab.default('rollups'),
      }),
    }),
    async (req, res) => {
      const data = await getScalingActivityData(req, manifest, cache)
      const html = render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  router.get('/scaling/risk', async (req, res) => {
    const data = await getScalingRiskData(req, manifest, cache)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/scaling/tvs', async (req, res) => {
    const data = await getScalingTvsData(req, manifest, cache)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/scaling/data-availability', async (req, res) => {
    const data = await getScalingDataAvailabilityData(req, manifest, cache)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/scaling/liveness', async (req, res) => {
    const data = await getScalingLivenessData(req, manifest, cache)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/scaling/finality', async (req, res) => {
    const data = await getScalingFinalityData(req, manifest, cache)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/scaling/costs', async (req, res) => {
    const data = await getScalingCostsData(req, manifest, cache)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/scaling/archived', async (req, res) => {
    const data = await getScalingArchivedData(req, manifest, cache)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/scaling/upcoming', async (req, res) => {
    const data = await getScalingUpcomingData(req, manifest, cache)
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/scaling/projects/:slug',
    validateRoute({
      params: z.object({ slug: z.string() }),
    }),
    async (req, res) => {
      const data = await cache.get(
        {
          key: ['scaling', 'projects', req.params.slug],
          ttl: 5 * 60,
          staleWhileRevalidate: 25 * 60,
        },
        () => getScalingProjectData(manifest, req.params.slug, req.originalUrl),
      )
      if (!data) {
        res.status(404).send('Not found')
        return
      }
      const html = render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  router.get(
    '/scaling/projects/:slug/tvs-breakdown',
    validateRoute({
      params: z.object({ slug: z.string() }),
    }),
    async (req, res) => {
      const data = await cache.get(
        {
          key: ['scaling', 'projects', req.params.slug, 'tvs-breakdown'],
          ttl: 5 * 60,
          staleWhileRevalidate: 25 * 60,
        },
        () =>
          getScalingProjectTvsBreakdownData(
            manifest,
            req.params.slug,
            req.originalUrl,
          ),
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
