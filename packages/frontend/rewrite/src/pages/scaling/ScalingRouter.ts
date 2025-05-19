import express from 'express'
import type { RenderFunction } from 'rewrite/src/ssr/types'
import { validateRoute } from 'rewrite/src/utils/validateRoute'
import { z } from 'zod'
import type { Manifest } from '~/utils/Manifest'
import type { DataCache } from '../../server/utils/Cache'
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
  cache: DataCache,
) {
  const router = express.Router()

  router.get('/scaling', async (req, res) => {
    res.redirect('/scaling/summary')
  })

  router.get('/scaling/summary', async (req, res) => {
    const data = await cache.getData(
      { key: '/scaling/summary', ttl: 60 * 10 },
      () => getScalingSummaryData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  router.get('/scaling/activity', async (req, res) => {
    const data = await cache.getData(
      { key: '/scaling/activity', ttl: 60 * 10 },
      () => getScalingActivityData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/scaling/risk', async (req, res) => {
    const data = await cache.getData(
      { key: '/scaling/risk', ttl: 60 * 10 },
      () => getScalingRiskData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/scaling/tvs', async (req, res) => {
    const data = await cache.getData(
      { key: '/scaling/tvs', ttl: 60 * 10 },
      () => getScalingTvsData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/scaling/data-availability', async (req, res) => {
    const data = await cache.getData(
      { key: '/scaling/data-availability', ttl: 60 * 10 },
      () => getScalingDataAvailabilityData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/scaling/liveness', async (req, res) => {
    const data = await cache.getData(
      { key: '/scaling/liveness', ttl: 60 * 10 },
      () => getScalingLivenessData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/scaling/finality', async (req, res) => {
    const data = await cache.getData(
      { key: '/scaling/finality', ttl: 60 * 10 },
      () => getScalingFinalityData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/scaling/costs', async (req, res) => {
    const data = await cache.getData(
      { key: '/scaling/costs', ttl: 60 * 10 },
      () => getScalingCostsData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/scaling/archived', async (req, res) => {
    const data = await cache.getData(
      { key: '/scaling/archived', ttl: 60 * 10 },
      () => getScalingArchivedData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/scaling/upcoming', async (req, res) => {
    const data = await cache.getData(
      { key: '/scaling/upcoming', ttl: 60 * 10 },
      () => getScalingUpcomingData(manifest, req.originalUrl),
    )
    const html = render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/scaling/projects/:slug',
    validateRoute({
      params: z.object({ slug: z.string() }),
    }),
    async (req, res) => {
      const data = await getScalingProjectData(
        manifest,
        req.params.slug,
        req.originalUrl,
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
      const data = await getScalingProjectTvsBreakdownData(
        manifest,
        req.params.slug,
        req.originalUrl,
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
