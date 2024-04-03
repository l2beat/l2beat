import Router from '@koa/router'

import { Clock } from '../../../tools/Clock'
import { TrackedTxsConfigsRepository } from '../repositories/TrackedTxsConfigsRepository'
import { renderTrackedTxsStatusPage } from './status/TrackedTxsStatusPage'

export function createTrackedTxsStatusRouter({
  clock,
  trackedTxsConfigsRepository: repository,
}: {
  clock: Clock
  trackedTxsConfigsRepository: TrackedTxsConfigsRepository
}) {
  const router = new Router()

  router.get('/status/tracked-txs', async (ctx) => {
    const allConfigs = await repository.getAll()
    const unusedIds = await repository.findUnusedConfigurationsIds()
    ctx.body = renderTrackedTxsStatusPage({
      data: allConfigs.map((config) => ({
        ...config,
        // TODO(imxeno): check if this condition is correct
        synced:
          !config.untilTimestampExclusive ||
          config.untilTimestampExclusive.gte(clock.getFirstHour()),
        unused: unusedIds.includes(config.id),
      })),
    })
  })

  return router
}
