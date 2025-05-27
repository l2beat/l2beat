import express from 'express'
import { validateRoute } from 'rewrite/src/utils/validateRoute'
import { z } from 'zod'
import {
  ActivityChartParams,
  getActivityChart,
} from '~/server/features/scaling/activity/get-activity-chart'
import { ActivityProjectFilterType } from '~/server/features/scaling/activity/utils/project-filter-utils'
import { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { getScalingApiEntries } from '~/server/features/scaling/summary/get-scaling-api-entries'
import { getTvsBreakdownForProject } from '~/server/features/scaling/tvs/breakdown/get-tvs-breakdown-for-project'
import type { TvsChartDataParams } from '~/server/features/scaling/tvs/get-tvs-chart-data'
import { getTvsChart } from '~/server/features/scaling/tvs/get-tvs-chart-data'
import { TvsProjectFilterType } from '~/server/features/scaling/tvs/utils/project-filter-utils'
import { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { ps } from '~/server/projects'

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

      const params: ActivityChartParams = {
        filter:
          type === 'projects'
            ? { type: 'projects', projectIds: projectIds?.split(',') ?? [] }
            : { type: type ?? 'all' },
        range: range ?? '30d',
        previewRecategorisation: false,
      }

      const { data } = await getActivityChart(params)
      const latestActivityData = data.at(-1)

      if (!latestActivityData) {
        res.json({
          success: false,
          error: 'Missing data.',
        })
      }

      // Strip ethereum data points
      const projectsDataPoints = data.map(
        ([timestamp, projectsTxCount, _, projectsUopsCount]) =>
          [timestamp, projectsTxCount, projectsUopsCount] as const,
      )

      res.json({
        success: true,
        data: {
          chart: {
            types: ['timestamp', 'count', 'uopsCount'],
            data: projectsDataPoints,
          },
        },
      })
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

      const isEthereum = slug === 'ethereum'
      const project = await ps.getProject({
        slug,
        where: ['activityConfig', 'isScaling'],
      })

      if (!project && !isEthereum) {
        res.json({
          success: false,
          error: 'Project not found.',
        })
      }

      const params: ActivityChartParams = {
        filter: isEthereum
          ? { type: 'all' }
          : { type: 'projects', projectIds: project ? [project.id] : [] },
        range: range ?? '30d',
        previewRecategorisation: false,
      }
      const parsedParams = ActivityChartParams.safeParse(params)
      if (parsedParams.error) {
        res.json({
          success: false,
          errors: parsedParams.error.errors,
        })
      }

      const { data } = await getActivityChart(params)

      const oldestProjectData = data.at(0)
      const latestProjectData = data.at(-1)

      if (!oldestProjectData || !latestProjectData) {
        res.json({
          success: false,
          error: 'Missing data.',
        })
      }

      // Unfortunately, ethereum data is being served along with other projects data
      const dataPoints = data.map(
        ([
          timestamp,
          projectsTxCount,
          ethereumTxCount,
          projectsUopsCount,
          ethereumUopsCount,
        ]) =>
          [
            timestamp,
            isEthereum ? ethereumTxCount : projectsTxCount,
            isEthereum ? ethereumUopsCount : projectsUopsCount,
          ] as const,
      )

      res.json({
        success: true,
        data: {
          chart: {
            types: ['timestamp', 'count', 'uopsCount'],
            data: dataPoints,
          },
        },
      })
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

      if (type === 'projects' && !projectIds) {
        res.json({
          success: false,
          errors: [{ message: 'projectIds is required for "projects" type' }],
        })
      }
      const params: TvsChartDataParams = {
        range: range ?? '30d',
        filter:
          type === 'projects'
            ? {
                type: 'projects',
                projectIds: projectIds?.split(',') ?? [],
              }
            : { type: type ?? 'layer2' },
        excludeAssociatedTokens: excludeAssociatedTokens === 'true',
        previewRecategorisation: false,
      }

      const data = await getTvsChart(params)

      const latestTvsData = data.at(-1)

      if (!latestTvsData) {
        res.json({
          success: false,
          error: 'Missing data.',
        })
        return
      }

      const usdValue = latestTvsData[1] + latestTvsData[2] + latestTvsData[3]
      const ethValue = usdValue / latestTvsData[4]

      res.json({
        success: true,
        data: {
          usdValue,
          ethValue,
          chart: {
            types: ['timestamp', 'native', 'canonical', 'external', 'ethPrice'],
            data: data.map(
              ([timestamp, native, canonical, external, ethPrice]) => [
                timestamp,
                native,
                canonical,
                external,
                ethPrice,
              ],
            ),
          },
        },
      })
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
      const project = await ps.getProject({
        slug,
        where: ['tvsConfig', 'isScaling'],
      })

      if (!project) {
        res.json({
          success: false,
          error: 'Project not found.',
        })
        return
      }

      const params: TvsChartDataParams = {
        range: range ?? '30d',
        filter: { type: 'projects', projectIds: [project.id] },
        excludeAssociatedTokens: excludeAssociatedTokens === 'true',
        previewRecategorisation: false,
      }

      const data = await getTvsChart(params)

      const oldestTvsData = data.at(0)
      const latestTvsData = data.at(-1)

      if (!oldestTvsData || !latestTvsData) {
        res.json({
          success: false,
          error: 'Missing data.',
        })
        return
      }

      const usdValue = latestTvsData[1] + latestTvsData[2] + latestTvsData[3]
      const ethValue = usdValue / latestTvsData[4]

      res.json({
        success: true,
        data: {
          usdValue,
          ethValue,
          chart: {
            types: ['timestamp', 'native', 'canonical', 'external', 'ethPrice'],
            data: data.map(
              ([timestamp, native, canonical, external, ethPrice]) => [
                timestamp,
                native,
                canonical,
                external,
                ethPrice,
              ],
            ),
          },
        },
      })
    },
  )

  router.get(
    '/api/scaling/tvs/:slug/breakdown',
    validateRoute({
      params: z.object({ slug: z.string() }),
    }),
    async (req, res) => {
      const { slug } = req.params

      const project = await ps.getProject({
        slug,
        select: ['tvsConfig'],
        optional: ['chainConfig', 'contracts'],
      })

      if (!project) {
        res.json({ success: false, error: 'Project not found.' })
        return
      }

      const data = await getTvsBreakdownForProject(project)
      res.json({ success: true, data })
    },
  )

  router.get('/api/scaling/summary', async (_, res) => {
    const [entries, data] = await Promise.all([
      getScalingApiEntries(),
      getTvsChart({
        range: '30d',
        excludeAssociatedTokens: false,
        filter: { type: 'layer2' },
        previewRecategorisation: false,
      }),
    ])
    res.json({
      chart: {
        types: ['timestamp', 'native', 'canonical', 'external', 'ethPrice'],
        data: data.map(([timestamp, native, canonical, external, ethPrice]) => [
          timestamp,
          native,
          canonical,
          external,
          ethPrice,
        ]),
      },
      projects: Object.fromEntries(entries.map((entry) => [entry.id, entry])),
    })
  })

  return router
}
