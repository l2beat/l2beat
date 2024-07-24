import Router from '@koa/router'

import { Database } from '@l2beat/database'
import { TrackedTxConfigEntry } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Clock } from '../../../tools/Clock'
import { findUnusedConfigs } from '../utils/findUnusedConfigs'
import { renderTrackedTxsStatusPage } from './status/TrackedTxsStatusPage'

export function createTrackedTxsStatusRouter({
  clock,
  db,
}: {
  clock: Clock
  db: Database
}) {
  const router = new Router()

  router.get('/status/tracked-txs', async (ctx) => {
    const allConfigs = await db.indexerConfiguration.getAll()
    const unusedIds = await findUnusedConfigs(db)
    // const unusedIds = await repository.findUnusedConfigurationsIds()
    ctx.body = renderTrackedTxsStatusPage({
      data: allConfigs.map((config) => {
        const parsedConfig = {
          ...config,
          properties: JSON.parse(config.properties) as TrackedTxConfigEntry,
        }
        const active =
          !!config.currentHeight &&
          (!config.maxHeight ||
            new UnixTime(config.maxHeight).gte(clock.getLastHour()))

        const healthy =
          active ||
          !!(
            config.currentHeight &&
            config.maxHeight &&
            new UnixTime(config.maxHeight).equals(
              new UnixTime(config.currentHeight),
            )
          )

        return {
          ...parsedConfig,
          active,
          healthy,
          unused: unusedIds.includes(config.id),
        }
      }),
    })
  })

  return router
}
