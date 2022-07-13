import Router from '@koa/router'
import { AssetId, branded, ProjectId } from '@l2beat/common'
import { z } from 'zod'

import { ReportController } from '../controllers/report/ReportController'
import { withTypedContext } from './types'

export function createReportRouter(reportController: ReportController) {
  const router = new Router()

  router.get('/api/data', async (ctx) => {
    const data = await reportController.getDaily()
    if (!data) {
      ctx.status = 404
      return
    }
    ctx.body = data
  })

  router.get(
    '/api/projects/:projectId/tvl/assets/:assetId',
    withTypedContext(
      z.object({
        params: z.object({
          projectId: branded(z.string(), ProjectId),
          assetId: branded(z.string(), AssetId),
        }),
      }),
      async (ctx) => {
        const { projectId, assetId } = ctx.params
        const chart = await reportController.getProjectAssetChart(
          projectId,
          assetId,
        )
        if (!chart) {
          ctx.status = 404
          return
        }
        ctx.body = chart
      },
    ),
  )

  return router
}
