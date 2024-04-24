import Router from '@koa/router'
import {
  assertUnreachable,
  branded,
  ProjectId,
  TrackedTxsConfigSubtype,
} from '@l2beat/shared-pure'
import { Context } from 'koa'
import { z } from 'zod'

import { withTypedContext } from '../../../../../api/types'
import { Config } from '../../../../../config'
import {
  LivenessController,
  LivenessResult,
  LivenessTransactionsResult,
} from './LivenessController'

export function createLivenessRouter(
  livenessController: LivenessController,
  config: Config,
) {
  const router = new Router()

  router.get('/api/liveness', async (ctx) => {
    const result = config.api.cache.liveness
      ? await livenessController.getCachedLivenessApiResponse()
      : await livenessController.getLiveness()

    if (result.type === 'error') {
      handleLivenessError(ctx, result)
      return
    }
    ctx.body = result.data
  })

  router.get('/api/liveness-transactions', async (ctx) => {
    const result = await livenessController.getLivenessTransactions()

    if (result.type === 'error') {
      handleLivenessError(ctx, result)
      return
    }

    ctx.body = result.data
  })

  router.get(
    '/api/liveness/:projectId/:livenessType',
    withTypedContext(
      z.object({
        params: z.object({
          projectId: branded(z.string(), ProjectId),
          livenessType: TrackedTxsConfigSubtype,
        }),
      }),
      async (ctx) => {
        const { livenessType, projectId } = ctx.params

        ctx.body = await livenessController.getLivenessPerProjectAndType(
          projectId,
          livenessType,
        )
      },
    ),
  )

  return router
}

function handleLivenessError(
  ctx: Context,
  result: Extract<
    LivenessResult | LivenessTransactionsResult,
    { type: 'error' }
  >,
) {
  switch (result.error) {
    case 'DATA_NOT_SYNCED':
      ctx.status = 404
      break
    default:
      assertUnreachable(result.error)
  }

  ctx.body = result.error
}
