import { v } from '@l2beat/validate'
import express from 'express'
import { ActivityProjectFilterType } from '~/server/features/scaling/activity/utils/projectFilterUtils'
import { TvsProjectFilterType } from '~/server/features/scaling/tvs/utils/projectFilterUtils'
import { optionToRange } from '~/utils/range/range'
import { validateRoute } from '~/utils/validateRoute'
import { getScalingActivityApiData } from './getScalingActivityApiData'
import { getScalingActivityProjectApiData } from './getScalingActivityProjectApiData'
import { getScalingSummaryApiData } from './getScalingSummaryApiData'
import { getScalingTvsApiData } from './getScalingTvsApiData'
import { getScalingTvsProjectApiData } from './getScalingTvsProjectApiData'
import { getScalingTvsProjectBreakdownApiData } from './getScalingTvsProjectBreakdownApiData'

const TvsRangeSchema = v.enum(['7d', '30d', '90d', '180d', '1y', 'max'])
const ActivityRangeSchema = v.enum(['30d', '90d', '180d', '1y', 'max'])

export function createPublicApiRouter() {
  const router = express.Router()

  router.get(
    '/api/scaling/activity',
    validateRoute({
      query: v.object({
        range: ActivityRangeSchema.optional(),
        type: ActivityProjectFilterType.optional(),
        projectIds: v.string().optional(),
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
        range: optionToRange(range ?? '30d'),
        type: type ?? 'all',
        projectIds: projectIds?.split(',') ?? [],
      })

      res.json(data)
    },
  )

  router.get(
    '/api/scaling/activity/:slug',
    validateRoute({
      params: v.object({ slug: v.string() }),
      query: v.object({ range: ActivityRangeSchema.optional() }),
    }),
    async (req, res) => {
      const { slug } = req.params
      const { range } = req.query

      const data = await getScalingActivityProjectApiData({
        slug,
        range: optionToRange(range ?? '30d'),
      })
      res.json(data)
    },
  )

  router.get(
    '/api/scaling/tvs',
    validateRoute({
      query: v.object({
        range: TvsRangeSchema.optional(),
        type: TvsProjectFilterType.optional(),
        projectIds: v.string().optional(),
        excludeAssociatedTokens: v.string().optional(),
        includeRwaRestrictedTokens: v.string().optional(),
      }),
    }),
    async (req, res) => {
      const {
        range,
        type,
        projectIds,
        excludeAssociatedTokens,
        includeRwaRestrictedTokens,
      } = req.query

      const data = await getScalingTvsApiData({
        range: optionToRange(range ?? '30d'),
        type: type ?? 'layer2',
        projectIds: projectIds?.split(',') ?? [],
        excludeAssociatedTokens: excludeAssociatedTokens === 'true',
        includeRwaRestrictedTokens: includeRwaRestrictedTokens === 'true',
      })
      res.json(data)
    },
  )

  router.get(
    '/api/scaling/tvs/:slug',
    validateRoute({
      params: v.object({ slug: v.string() }),
      query: v.object({
        range: TvsRangeSchema.optional(),
        excludeAssociatedTokens: v.string().optional(),
        includeRwaRestrictedTokens: v.string().optional(),
      }),
    }),
    async (req, res) => {
      const { slug } = req.params
      const { range, excludeAssociatedTokens, includeRwaRestrictedTokens } =
        req.query

      const data = await getScalingTvsProjectApiData({
        slug,
        range: optionToRange(range ?? '30d'),
        excludeAssociatedTokens: excludeAssociatedTokens === 'true',
        includeRwaRestrictedTokens: includeRwaRestrictedTokens === 'true',
      })
      res.json(data)
    },
  )

  router.get(
    '/api/scaling/tvs/:slug/breakdown',
    validateRoute({
      params: v.object({ slug: v.string() }),
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
