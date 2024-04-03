import Router from '@koa/router'

import { TrackedTxsConfigsRepository } from '../repositories/TrackedTxsConfigsRepository'
import { renderTrackedTxsStatusPage } from './status/TrackedTxsStatusPage'

export function createTrackedTxsStatusRouter(
  repository: TrackedTxsConfigsRepository,
) {
  const router = new Router()

  router.get('/status/tracked-txs', async (ctx) => {
    const allConfigs = await repository.getAll()
    const unusedIds = await repository.findUnusedConfigurationsIds()
    ctx.body = renderTrackedTxsStatusPage({
      data: allConfigs.map((config) => ({
        ...config,
        unused: unusedIds.includes(config.id),
      })),
    })
  })

  return router
}
