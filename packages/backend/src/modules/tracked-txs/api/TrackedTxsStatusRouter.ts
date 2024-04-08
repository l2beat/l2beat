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
        // active if:
        // - untilTimestampExclusive is not set
        // - untilTimestampExclusive is greater than the last hour
        // - untilTimestampExclusive is equal to the last synced timestamp (so we synced everything)
        active: Boolean(
          !config.untilTimestampExclusive ||
            config.untilTimestampExclusive.gte(clock.getLastHour()) ||
            (config.lastSyncedTimestamp &&
              config.untilTimestampExclusive.equals(
                config.lastSyncedTimestamp,
              )),
        ),
        unused: unusedIds.includes(config.id),
      })),
    })
  })

  return router
}
