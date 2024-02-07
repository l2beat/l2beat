import Router from '@koa/router'
import {
  AssetId,
  AssetType,
  branded,
  ChainId,
  ProjectId,
} from '@l2beat/shared-pure'
import { z } from 'zod'

import { withTypedContext } from '../../api/routers/types'
import { ApiConfig } from '../../config/Config'
import { TvlController } from './TvlController'

export function createTvlRouter(
  tvlController: TvlController,
  config: ApiConfig,
) {
  const router = new Router()

  router.get('/api/tvl', async (ctx) => {
    const tvlResult = config.cache.tvl
      ? await tvlController.getCachedTvlApiResponse()
      : await tvlController.getTvlApiResponse()

    if (tvlResult.result === 'error') {
      if (tvlResult.error === 'DATA_NOT_FULLY_SYNCED') {
        ctx.status = 404
        ctx.body = tvlResult.error
      }

      if (tvlResult.error === 'NO_DATA') {
        ctx.status = 404
        ctx.body = tvlResult.error
      }

      return
    }

    ctx.body = tvlResult.data
  })

  router.get(
    '/api/tvl/aggregate',
    withTypedContext(
      z.object({
        query: z.object({
          projectSlugs: z.string(),
        }),
      }),
      async (ctx) => {
        console.time('[Aggregate endpoint]: runtime')
        const projectSlugs = ctx.query.projectSlugs

        const tvlProjectsResponse =
          await tvlController.getAggregatedTvlApiResponse(
            projectSlugs.split(',').map((slug) => slug.trim()),
          )

        if (tvlProjectsResponse.result === 'error') {
          if (tvlProjectsResponse.error === 'DATA_NOT_FULLY_SYNCED') {
            ctx.status = 404
            ctx.body = tvlProjectsResponse.error
          }

          if (tvlProjectsResponse.error === 'NO_DATA') {
            ctx.status = 404
            ctx.body = tvlProjectsResponse.error
          }

          return
        }

        ctx.body = tvlProjectsResponse.data

        console.timeEnd('[Aggregate endpoint]: runtime')
      },
    ),
  )

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

        const assetData = await tvlController.getAssetTvlApiResponse(
          projectId,
          ChainId(+chainId),
          assetId,
          assetType,
        )

        if (assetData.result === 'error') {
          if (assetData.error === 'NO_DATA') {
            ctx.status = 404
            ctx.body = assetData.error
          }

          if (assetData.error === 'INVALID_PROJECT_OR_ASSET') {
            ctx.status = 400
            ctx.body = assetData.error
          }

          return
        }

        ctx.body = assetData.data
      },
    ),
  )

  router.get('/api/project-assets-breakdown', async (ctx) => {
    const projectAssetsBreakdown =
      await tvlController.getProjectTokenBreakdownApiResponse()

    if (projectAssetsBreakdown.result === 'error') {
      if (projectAssetsBreakdown.error === 'NO_DATA') {
        ctx.status = 404
        ctx.body = projectAssetsBreakdown.error
      }

      if (projectAssetsBreakdown.error === 'DATA_NOT_FULLY_SYNCED') {
        ctx.status = 404
        ctx.body = projectAssetsBreakdown.error
      }

      return
    }

    ctx.body = projectAssetsBreakdown.data
  })

  return router
}
