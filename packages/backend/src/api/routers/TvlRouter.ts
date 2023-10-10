import Router from '@koa/router'
import {
  AssetId,
  AssetType,
  branded,
  ChainId,
  ProjectId,
} from '@l2beat/shared-pure'
import { z } from 'zod'

import { DetailedTvlController } from '../controllers/tvl/DetailedTvlController'
import { TvlController } from '../controllers/tvl/TvlController'
import { withTypedContext } from './types'

export function createTvlRouter(
  tvlController: TvlController,
  detailedTvlController: DetailedTvlController,
) {
  const router = new Router()

  // endpoint that will return tvl of specific projects
  // accepts projectIds[] as query params
  // /api/tvl/projects + projectIds[]
  router.get(
    '/api/tvl/aggregate',
    withTypedContext(
      z.object({
        query: z.object({
          projectSlugs: z.string(),
        }),
      }),
      async (ctx) => {
        // get projectIds from query params
        const projectSlugs = ctx.query.projectSlugs
        // get tvl data for each project
        const tvlProjectsResponse =
          await detailedTvlController.getDetailedAggregatedApiResponse(
            projectSlugs.split(',').map((slug) => slug.trim()),
          )

        if (tvlProjectsResponse.result === 'error') {
          if (tvlProjectsResponse.error === 'DATA_NOT_FULLY_SYNCED') {
            ctx.status = 422
          }

          if (tvlProjectsResponse.error === 'NO_DATA') {
            ctx.status = 404
          }

          return
        }

        ctx.body = tvlProjectsResponse.data
      },
    ),
  )

  router.get('/api/tvl', async (ctx) => {
    const tvlResponse = await tvlController.getTvlApiResponse()
    if (tvlResponse.result === 'error') {
      if (tvlResponse.error === 'DATA_NOT_FULLY_SYNCED') {
        ctx.status = 422
      }

      if (tvlResponse.error === 'NO_DATA') {
        ctx.status = 404
      }

      return
    }

    ctx.body = tvlResponse.data
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
        const chartResponse = await tvlController.getProjectAssetChart(
          projectId,
          assetId,
        )
        if (chartResponse.result === 'error') {
          if (chartResponse.error === 'NO_DATA') {
            ctx.status = 404
          }

          if (chartResponse.error === 'INVALID_PROJECT_OR_ASSET') {
            ctx.status = 400
          }

          return
        }
        ctx.body = chartResponse.data
      },
    ),
  )

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
          assetType: branded(z.string(), AssetType),
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

  router.get('/api/project-assets-breakdown', async (ctx) => {
    const projectAssetsBreakdown =
      await detailedTvlController.getProjectTokenBreakdownApiResponse()

    if (projectAssetsBreakdown.result === 'error') {
      if (projectAssetsBreakdown.error === 'NO_DATA') {
        ctx.status = 404
      }

      if (projectAssetsBreakdown.error === 'DATA_NOT_FULLY_SYNCED') {
        ctx.status = 422
      }

      return
    }

    ctx.body = projectAssetsBreakdown.data
  })

  return router
}
