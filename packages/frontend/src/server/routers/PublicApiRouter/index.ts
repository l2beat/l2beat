import { v } from '@l2beat/validate'
import express from 'express'
import { ActivityProjectFilterType } from '~/server/features/layer2s/activity/utils/projectFilterUtils'
import { TvsProjectFilterType } from '~/server/features/layer2s/tvs/utils/projectFilterUtils'
import { optionToRange } from '~/utils/range/range'
import { validateRoute } from '~/utils/validateRoute'
import { getLayer2sActivityApiData } from './getLayer2sActivityApiData'
import { getLayer2sActivityProjectApiData } from './getLayer2sActivityProjectApiData'
import { getLayer2sSummaryApiData } from './getLayer2sSummaryApiData'
import { getLayer2sTvsApiData } from './getLayer2sTvsApiData'
import { getLayer2sTvsProjectApiData } from './getLayer2sTvsProjectApiData'
import { getLayer2sTvsProjectBreakdownApiData } from './getLayer2sTvsProjectBreakdownApiData'

const TvsRangeSchema = v.enum(['7d', '30d', '90d', '180d', '1y', 'max'])
const ActivityRangeSchema = v.enum(['30d', '90d', '180d', '1y', 'max'])

export function createPublicApiRouter() {
  const router = express.Router()

  // Legacy alias: keep /api/scaling/* working for existing API consumers
  router.use((req, _res, next) => {
    if (req.url === '/api/scaling' || req.url.startsWith('/api/scaling/')) {
      req.url = req.url.replace('/api/scaling', '/api/layer2s')
    }
    next()
  })

  router.get(
    '/api/layer2s/activity',
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

      const data = await getLayer2sActivityApiData({
        range: optionToRange(range ?? '30d'),
        type: type ?? 'all',
        projectIds: projectIds?.split(',') ?? [],
      })

      res.json(data)
    },
  )

  router.get(
    '/api/layer2s/activity/:slug',
    validateRoute({
      params: v.object({ slug: v.string() }),
      query: v.object({ range: ActivityRangeSchema.optional() }),
    }),
    async (req, res) => {
      const { slug } = req.params
      const { range } = req.query

      const data = await getLayer2sActivityProjectApiData({
        slug,
        range: optionToRange(range ?? '30d'),
      })
      res.json(data)
    },
  )

  router.get(
    '/api/layer2s/tvs',
    validateRoute({
      query: v.object({
        range: TvsRangeSchema.optional(),
        type: TvsProjectFilterType.optional(),
        projectIds: v.string().optional(),
        excludeAssociatedTokens: v.string().optional(),
        excludeRwaRestrictedTokens: v.string().optional(),
      }),
    }),
    async (req, res) => {
      const {
        range,
        type,
        projectIds,
        excludeAssociatedTokens,
        excludeRwaRestrictedTokens,
      } = req.query

      const data = await getLayer2sTvsApiData({
        range: optionToRange(range ?? '30d'),
        type: type ?? 'layer2',
        projectIds: projectIds?.split(',') ?? [],
        excludeAssociatedTokens: excludeAssociatedTokens === 'true',
        excludeRwaRestrictedTokens: excludeRwaRestrictedTokens !== 'false',
      })
      res.json(data)
    },
  )

  router.get(
    '/api/layer2s/tvs/:slug',
    validateRoute({
      params: v.object({ slug: v.string() }),
      query: v.object({
        range: TvsRangeSchema.optional(),
        excludeAssociatedTokens: v.string().optional(),
        excludeRwaRestrictedTokens: v.string().optional(),
      }),
    }),
    async (req, res) => {
      const { slug } = req.params
      const { range, excludeAssociatedTokens, excludeRwaRestrictedTokens } =
        req.query

      const data = await getLayer2sTvsProjectApiData({
        slug,
        range: optionToRange(range ?? '30d'),
        excludeAssociatedTokens: excludeAssociatedTokens === 'true',
        excludeRwaRestrictedTokens: excludeRwaRestrictedTokens !== 'false',
      })
      res.json(data)
    },
  )

  router.get(
    '/api/layer2s/tvs/:slug/breakdown',
    validateRoute({
      params: v.object({ slug: v.string() }),
    }),
    async (req, res) => {
      const data = await getLayer2sTvsProjectBreakdownApiData(req.params.slug)
      res.json(data)
    },
  )

  router.get('/api/layer2s/summary', async (_, res) => {
    const data = await getLayer2sSummaryApiData()
    res.json(data)
  })

  return router
}
