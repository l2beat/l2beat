import type { InMemoryCache } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import express from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { validateRoute } from '~/utils/validateRoute'
import { getLayer2sActivityData } from './activity/getLayer2sActivityData'
import { getLayer2sArchivedData } from './archived/getLayer2sArchivedData'
import { getLayer2sCostsData } from './costs/getLayer2sCostsData'
import { getLayer2sLivenessData } from './liveness/getLayer2sLivenessData'
import { getLayer2sProjectData } from './project/getLayer2sProjectData'
import { getLayer2sProjectTvsBreakdownData } from './project/tvs-breakdown/getLayer2sProjectTvsBreakdownData'
import { getLayer2sRiskDataAvailabilityData } from './risk/data-availability/getLayer2sRiskDataAvailabilityData'
import { getLayer2sRiskData } from './risk/getLayer2sRiskData'
import { getLayer2sRiskSequencingData } from './risk/sequencing/getLayer2sRiskSequencingData'
import { getLayer2sRiskStateValidationData } from './risk/state-validation/getLayer2sRiskStateValidationData'
import { getLayer2sSummaryData } from './summary/getLayer2sSummaryData'
import { getLayer2sTvsBreakdownData } from './tvs/breakdown/getLayer2sTvsBreakdownData'
import { getLayer2sTvsData } from './tvs/getLayer2sTvsData'
export function createLayer2sRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  const router = express.Router()

  router.get('/layer2s', (_req, res) => {
    res.redirect(301, '/layer2s/summary')
  })

  router.get('/layer2s/summary', async (req, res) => {
    const data = await getLayer2sSummaryData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/layer2s/activity', async (req, res) => {
    const data = await getLayer2sActivityData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/layer2s/risk', async (req, res) => {
    const data = await getLayer2sRiskData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/layer2s/risk/state-validation', async (req, res) => {
    const data = await getLayer2sRiskStateValidationData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/layer2s/risk/data-availability', async (req, res) => {
    const data = await getLayer2sRiskDataAvailabilityData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/layer2s/risk/sequencing', async (req, res) => {
    const data = await getLayer2sRiskSequencingData(req, manifest, cache)
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
      const data = await getLayer2sTvsData(req, manifest, cache)
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  router.get('/layer2s/tvs/breakdown', async (req, res) => {
    const data = await getLayer2sTvsBreakdownData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get('/layer2s/liveness', async (req, res) => {
    const data = await getLayer2sLivenessData(req, manifest, cache)
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
      const data = await getLayer2sCostsData(req, manifest, cache)
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    },
  )

  router.get('/layer2s/archived', async (req, res) => {
    const data = await getLayer2sArchivedData(req, manifest, cache)
    const html = await render(data, req.originalUrl)
    res.status(200).send(html)
  })

  router.get(
    '/layer2s/projects/:slug',
    validateRoute({
      params: v.object({ slug: v.string() }),
    }),
    async (req, res) => {
      const data = await cache.get(
        {
          key: ['layer2s', 'projects', req.params.slug],
          ttl: 5 * 60,
          staleWhileRevalidate: 25 * 60,
        },
        () => getLayer2sProjectData(manifest, req.params.slug, req.originalUrl),
      )
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
          getLayer2sProjectTvsBreakdownData(
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
