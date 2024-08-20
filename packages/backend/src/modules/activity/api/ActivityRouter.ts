import Router from '@koa/router'
import { assertUnreachable } from '@l2beat/shared-pure'
import { Context } from 'koa'
import { z } from 'zod'

import { withTypedContext } from '../../../api/types'
import {
  ActivityController,
  ActivityResult,
  AggregatedActivityResult,
  MapSlugsToProjectIdsResult,
} from './ActivityController'

export function createActivityRouter(activityController: ActivityController) {
  const router = new Router()

  router.get('/api/activity', async (ctx) => {
    const result = await activityController.getActivity()
    if (result.type === 'error') {
      handleActivityError(ctx, result)
      return
    }

    ctx.body = result.data
  })

  router.get(
    '/api/activity/aggregate',
    withTypedContext(
      z.object({
        query: z.object({
          projectSlugs: z.string(),
        }),
      }),
      async (ctx) => {
        const slugs = ctx.query.projectSlugs
          .split(',')
          .map((slug) => slug.trim())

        const projectIdsResult = activityController.mapSlugsToProjectIds(slugs)
        if (projectIdsResult.type === 'error') {
          handleActivityError(ctx, projectIdsResult)
          return
        }

        const aggregatedResult = await activityController.getAggregatedActivity(
          projectIdsResult.data,
        )
        if (aggregatedResult.type === 'error') {
          handleActivityError(ctx, aggregatedResult)
          return
        }

        ctx.body = aggregatedResult.data
      },
    ),
  )

  router.get('/api/activity/status', (ctx) => {
    ctx.body = activityController.getStatus()
  })

  return router
}

function handleActivityError(
  ctx: Context,
  result: Extract<
    ActivityResult | AggregatedActivityResult | MapSlugsToProjectIdsResult,
    { type: 'error' }
  >,
) {
  switch (result.error) {
    case 'UNKNOWN_PROJECT':
    case 'NO_TRANSACTION_API':
    case 'DATA_NOT_SYNCED':
    case 'ETHEREUM_DATA_DELAYED':
      ctx.status = 404
      break
    case 'EMPTY_PROJECTS':
      ctx.status = 401
      break
    default:
      assertUnreachable(result)
  }

  ctx.body = result.error
}
