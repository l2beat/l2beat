import type { Router } from 'express'
import type { Manifest } from 'rewrite/src/common/Manifest'
import type { RenderFunction } from 'rewrite/src/ssr/server'
import { validateRoute } from 'rewrite/src/ssr/validateRoute'
import { z } from 'zod'
import { getScalingActivityData } from './activity/getScalingActivityData'
import { getScalingArchivedData } from './archived/getScalingArchivedData'
import { getScalingCostsData } from './costs/getScalingCostsData'
import { getScalingDataAvailabilityData } from './data-availability/getScalingDataAvailabilityData'
import { getScalingFinalityData } from './finality/getScalingFinalityData'
import { getScalingLivenessData } from './liveness/getScalingLivenessData'
import { getScalingProjectData } from './projects/:slug/getScalingProjectData'
import { getScalingRiskData } from './risk/getScalingRiskData'
import { getScalingSummaryData } from './summary/getScalingSummaryData'
import { getScalingTvsData } from './tvs/getScalingTvsData'
import { getScalingUpcomingData } from './upcoming/getScalingUpcomingData'

export function ScalingRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/scaling', async (req, res) => {
    res.redirect('/scaling/summary')
  })

  app.get('/scaling/summary', async (req, res) => {
    const data = await getScalingSummaryData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  app.get('/scaling/activity', async (req, res) => {
    const data = await getScalingActivityData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  app.get('/scaling/risk', async (req, res) => {
    const data = await getScalingRiskData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  app.get('/scaling/tvs', async (req, res) => {
    const data = await getScalingTvsData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  app.get('/scaling/data-availability', async (req, res) => {
    const data = await getScalingDataAvailabilityData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  app.get('/scaling/liveness', async (req, res) => {
    const data = await getScalingLivenessData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  app.get('/scaling/finality', async (req, res) => {
    const data = await getScalingFinalityData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  app.get('/scaling/costs', async (req, res) => {
    const data = await getScalingCostsData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  app.get('/scaling/archived', async (req, res) => {
    const data = await getScalingArchivedData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  app.get('/scaling/upcoming', async (req, res) => {
    const data = await getScalingUpcomingData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  app.get(
    '/scaling/projects/:slug',
    validateRoute({
      params: z.object({ slug: z.string() }),
    }),
    async (req, res) => {
      const data = await getScalingProjectData(manifest, req.params.slug)
      if (!data) {
        res.status(404).send('Not found')
        return
      }
      const html = render(data, req.originalUrl)
      res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
    },
  )
}
