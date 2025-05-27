import express from 'express'
import { validateRoute } from 'rewrite/src/utils/validateRoute'
import { z } from 'zod'
import { getScalingActivityApiData } from '~/app/api/(public)/_fns/getScalingActivityApiData'
import { getScalingActivityProjectApiData } from '~/app/api/(public)/_fns/getScalingActivityProjectApiData'
import { getScalingSummaryApiData } from '~/app/api/(public)/_fns/getScalingSummaryApiData'
import { getScalingTvsApiData } from '~/app/api/(public)/_fns/getScalingTvsApiData'
import { getScalingTvsProjectApiData } from '~/app/api/(public)/_fns/getScalingTvsProjectApiData'
import { getScalingTvsProjectBreakdownApiData } from '~/app/api/(public)/_fns/getScalingTvsProjectBreakdownApiData'
import { ActivityProjectFilterType } from '~/server/features/scaling/activity/utils/project-filter-utils'
import { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { TvsProjectFilterType } from '~/server/features/scaling/tvs/utils/project-filter-utils'
import { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'

export function createPublicApiRouter() {
  const router = express.Router()

  router.use('/api', (_, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    next()
  })

  router.get(
    '/api/scaling/activity',
    validateRoute({
      query: z.object({
        range: ActivityTimeRange.optional(),
        type: ActivityProjectFilterType.optional(),
        projectIds: z.string().optional(),
      }),
    }),
    async (req, res) => {
      const { range, type, projectIds } = req.query
      if (type === 'projects' && !projectIds) {
        res.json({
          success: false,
          errors: [{ message: 'projectIds is required for "projects" type' }],
        })
      }

      const data = await getScalingActivityApiData({
        range: range ?? '30d',
        type: type ?? 'all',
        projectIds: projectIds?.split(',') ?? [],
      })

      res.json(data)
    },
  )

  router.get(
    '/api/scaling/activity/:slug',
    validateRoute({
      params: z.object({ slug: z.string() }),
      query: z.object({ range: ActivityTimeRange.optional() }),
    }),
    async (req, res) => {
      const { slug } = req.params
      const { range } = req.query

      const data = await getScalingActivityProjectApiData({
        slug,
        range: range ?? '30d',
      })
      res.json(data)
    },
  )

  router.get(
    '/api/scaling/tvs',
    validateRoute({
      query: z.object({
        range: TvsChartRange.optional(),
        type: TvsProjectFilterType.optional(),
        projectIds: z.string().optional(),
        excludeAssociatedTokens: z.string().optional(),
      }),
    }),
    async (req, res) => {
      const { range, type, projectIds, excludeAssociatedTokens } = req.query

      const data = await getScalingTvsApiData({
        range: range ?? '30d',
        type: type ?? 'layer2',
        projectIds: projectIds?.split(',') ?? [],
        excludeAssociatedTokens: excludeAssociatedTokens === 'true',
      })
      res.json(data)
    },
  )

  router.get(
    '/api/scaling/tvs/:slug',
    validateRoute({
      params: z.object({ slug: z.string() }),
      query: z.object({
        range: TvsChartRange.optional(),
        excludeAssociatedTokens: z.string().optional(),
      }),
    }),
    async (req, res) => {
      const { slug } = req.params
      const { range, excludeAssociatedTokens } = req.query

      const data = await getScalingTvsProjectApiData({
        slug,
        range: range ?? '30d',
        excludeAssociatedTokens: excludeAssociatedTokens === 'true',
      })
      res.json(data)
    },
  )

  router.get(
    '/api/scaling/tvs/:slug/breakdown',
    validateRoute({
      params: z.object({ slug: z.string() }),
    }),
    async (req, res) => {
      const data = await getScalingTvsProjectBreakdownApiData(req.params.slug)
      res.json(data)
    },
  )

  router.get('/api/scaling/summary', async (_, res) => {
    const data = await getScalingSummaryApiData()
    res.json(data)
  })

  return router
}
