import Router from '@koa/router'
import {
  assertUnreachable,
  AssetId,
  AssetType,
  branded,
  ChainId,
  ProjectId,
} from '@l2beat/shared-pure'
import { Context } from 'koa'
import { z } from 'zod'

import { withTypedContext } from '../../../api/types'
import { ApiConfig } from '../../../config/Config'
import {
  AggregatedTvlResult,
  TokenTvlResult,
  TvlController,
  TvlResult,
} from './TvlController'

export function createTvlRouter(
  tvlController: TvlController,
  config: ApiConfig,
) {
  const router = new Router()

  router.get('/api/tvl', async (ctx) => {
    const tvlResult = config.cache.tvl
      ? await tvlController.getCachedTvlApiResponse()
      : await tvlController.getTvlApiResponse()

    if (tvlResult.type === 'error') {
      handleTvlError(ctx, tvlResult)
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

        if (tvlProjectsResponse.type === 'error') {
          handleTvlError(ctx, tvlProjectsResponse)
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

        if (assetData.type === 'error') {
          handleTvlError(ctx, assetData)
          return
        }

        ctx.body = assetData.data
      },
    ),
  )

  router.get('/api/project-assets-breakdown', async (ctx) => {
    const projectAssetsBreakdown =
      await tvlController.getProjectTokenBreakdownApiResponse()

    if (projectAssetsBreakdown.type === 'error') {
      handleTvlError(ctx, projectAssetsBreakdown)
      return
    }

    ctx.body = projectAssetsBreakdown.data
  })

  return router
}

function handleTvlError(
  ctx: Context,
  result: Extract<
    TvlResult | TokenTvlResult | AggregatedTvlResult,
    { type: 'error' }
  >,
) {
  switch (result.error) {
    case 'DATA_NOT_FULLY_SYNCED':
    case 'NO_DATA':
      ctx.status = 404
      break
    case 'EMPTY_SLUG':
    case 'INVALID_PROJECT_OR_ASSET':
      ctx.status = 400
      break
    default:
      assertUnreachable(result)
  }

  ctx.body = result.error
}
