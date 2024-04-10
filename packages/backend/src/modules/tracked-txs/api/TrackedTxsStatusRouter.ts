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
      data: allConfigs.map((config) => {
        const active =
          !!config.lastSyncedTimestamp &&
          (!config.untilTimestampExclusive ||
            config.untilTimestampExclusive.gte(clock.getLastHour()))

        const healthy =
          active ||
          !!(
            config.lastSyncedTimestamp &&
            config.untilTimestampExclusive &&
            config.untilTimestampExclusive.equals(config.lastSyncedTimestamp)
          )

        return {
          ...config,
          active,
          healthy,
          unused: unusedIds.includes(config.id),
        }
      }),
    })
  })

  return router
}
