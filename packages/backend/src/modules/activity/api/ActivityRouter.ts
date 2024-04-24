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
    const data = await activityController.getActivity()
    ctx.body = data
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

        const data = await activityController.getAggregatedActivity(
          projectIdsResult.data,
        )
        if (data.type === 'error') {
          handleActivityError(ctx, data)
          return
        }

        ctx.body = data
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
