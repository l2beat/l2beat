import Router from '@koa/router'
import {
  AssetId,
  branded,
  ChainId,
  ProjectId,
  ValueType,
} from '@l2beat/shared-pure'
import { z } from 'zod'

import { DetailedTvlController } from '../controllers/tvl/DetailedTvlController'
import { TvlController } from '../controllers/tvl/TvlController'
import { withTypedContext } from './types'

export function createTvlRouter(
  tvlController: TvlController,
  detailedTvlController: DetailedTvlController,
  features: {
    detailedTvlEnabled: boolean
  },
) {
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

  if (features.detailedTvlEnabled) {
    router.get('/api/detailed-tvl', async (ctx) => {
      const detailedTvlResult =
        await detailedTvlController.getDetailedTvlApiResponse()

      if (detailedTvlResult.result === 'error') {
        if (detailedTvlResult.error === 'DATA_NOT_FULLY_SYNCED') {
          ctx.status = 422
        }

        if (detailedTvlResult.error === 'NO_DATA') {
          ctx.status = 404
        }

        return
      }

      ctx.body = detailedTvlResult.data
    })

    router.get(
      '/api/projects/:projectId/tvl/chains/:chainId/assets/:assetId/types/:assetType',

      withTypedContext(
        z.object({
          params: z.object({
            chainId: z.string(),
            projectId: branded(z.string(), ProjectId),
            assetId: branded(z.string(), AssetId),
            assetType: branded(z.string(), ValueType),
          }),
        }),
        async (ctx) => {
          const { assetId, chainId, assetType, projectId } = ctx.params

          const detailedAssetData =
            await detailedTvlController.getDetailedAssetTvlApiResponse(
              projectId,
              ChainId(+chainId),
              assetId,
              assetType,
            )

          if (detailedAssetData.result === 'error') {
            if (detailedAssetData.error === 'NO_DATA') {
              ctx.status = 404
            }

            if (detailedAssetData.error === 'INVALID_PROJECT_OR_ASSET') {
              ctx.status = 400
            }

            return
          }

          ctx.body = detailedAssetData.data
        },
      ),
    )
  }

  return router
}
