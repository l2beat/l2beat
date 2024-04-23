import Router from '@koa/router'
import { Logger } from '@l2beat/backend-tools'
import { Gauge } from 'prom-client'

import { Config } from '../../config/Config'
import { Peripherals } from '../../peripherals/Peripherals'
import { TaskQueue } from '../../tools/queue/TaskQueue'
import { IndexerConfigurationRepository } from '../../tools/uif/IndexerConfigurationRepository'
import { IndexerStateRepository } from '../../tools/uif/IndexerStateRepository'
import { ApplicationModule } from '../ApplicationModule'
import { createStatusRouter } from './StatusRouter'

export function createStatusModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
): ApplicationModule | undefined {
  if (!config.statusEnabled) {
    logger.info('StatusModule disabled')
    return
  }

  const routers: Router[] = [
    createStatusRouter(
      peripherals.getRepository(IndexerStateRepository),
      peripherals.getRepository(IndexerConfigurationRepository),
    ),
  ]

  const taskQueue = new TaskQueue(
    () => setIndexerGauges(),
    logger.for('StatusModule'),
    {
      metricsId: 'setIndexerGauges',
    },
  )

  // TODO: add labels for automatic grouping in grafana
  // this can be achieved via tagging indexers e.g. name::tag
  const gauges = new Map<string, Gauge>()
  const setIndexerGauges = async () => {
    const indexers = await peripherals
      .getRepository(IndexerStateRepository)
      .getAll()

    for (const i of indexers) {
      const name = i.indexerId.replaceAll('-', '_')
      const gauge = gauges.get(name)
      if (!gauge) {
        gauges.set(
          name,
          new Gauge({
            name,
            help: 'Value showing the safe height of the indexer',
          }),
        )
        gauges.get(name)?.set(i.safeHeight)
      } else {
        gauge.set(i.safeHeight)
      }
    }
  }

  const start = () => {
    logger = logger.for('StatusModule')
    logger.info('Started')

    setInterval(() => taskQueue.addToFront({}), 5000)
  }

  return {
    start,
    routers,
  }
}
