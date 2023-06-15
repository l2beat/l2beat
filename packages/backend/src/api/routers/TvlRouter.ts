import Router from '@koa/router'
import { AssetId, branded, ProjectId } from '@l2beat/shared-pure'
import { z } from 'zod'

import { TvlController } from '../controllers/tvl/TvlController'
import { withTypedContext } from './types'

export function createTvlRouter(tvlController: TvlController) {
  const router = new Router()

  router.get('/api/tvl', async (ctx) => {
    const data = await tvlController.getTvlApiResponse()
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
        const chart = await tvlController.getProjectAssetChart(
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
