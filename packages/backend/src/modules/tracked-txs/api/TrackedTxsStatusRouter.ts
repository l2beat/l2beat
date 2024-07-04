import Router from '@koa/router'

import { TrackedTxConfigEntry } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Clock } from '../../../tools/Clock'
import { IndexerConfigurationRepository } from '../../../tools/uif/IndexerConfigurationRepository'
import { L2CostsRepository } from '../modules/l2-costs/repositories/L2CostsRepository'
import { LivenessRepository } from '../modules/liveness/repositories/LivenessRepository'
import { findUnusedConfigs } from '../utils/findUnusedConfigs'
import { renderTrackedTxsStatusPage } from './status/TrackedTxsStatusPage'

export function createTrackedTxsStatusRouter({
  clock,
  indexerConfigurationRepository,
  l2CostsRepository,
  livenessRepository,
}: {
  clock: Clock
  indexerConfigurationRepository: IndexerConfigurationRepository
  l2CostsRepository: L2CostsRepository
  livenessRepository: LivenessRepository
}) {
  const router = new Router()

  router.get('/status/tracked-txs', async (ctx) => {
    const allConfigs = await indexerConfigurationRepository.getAll()
    const unusedIds = await findUnusedConfigs(
      indexerConfigurationRepository,
      l2CostsRepository,
      livenessRepository,
    )
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
