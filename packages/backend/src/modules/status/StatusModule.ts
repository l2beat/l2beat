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
      metricsId: 'StatusModule',
    },
  )

  const gauges = new Map<string, Gauge>()
  const setIndexerGauges = async () => {
    const indexers = await peripherals
      .getRepository(IndexerStateRepository)
      .getAll()

    for (const i of indexers) {
      const parts = i.indexerId.split('::')
      const name = parts[0].replaceAll('-', '_')
      const tag = parts[1]

      const id = getGaugeId(name, tag)

      const gauge = gauges.get(id)

      if (!gauge) {
        if (tag) {
          gauges.set(
            id,
            new Gauge({
              name: id,
              help: 'Value showing the safe height of the indexer',
              labelNames: ['tag'],
            }),
          )
          gauges.get(id)?.set({ tag }, i.safeHeight)
        } else {
          gauges.set(
            id,
            new Gauge({
              name: id,
              help: 'Value showing the safe height of the indexer',
            }),
          )
          gauges.get(id)?.set(i.safeHeight)
        }
      } else {
        if (tag) {
          gauge.set({ tag }, i.safeHeight)
        } else {
          gauge.set(i.safeHeight)
        }
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

function getGaugeId(name: string, tag?: string): string {
  if (tag === undefined) {
    return name
  }

  return `${name}::tagged`
}
