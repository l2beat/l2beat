import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { Config } from '../../config'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import type { ApplicationModule } from '../ApplicationModule'

export function initTvsModule(
  config: Config,
  logger: Logger,
  _database: Database,
  _providers: Providers,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.tvs) {
    logger.info('TvsModule disabled')
    return
  }

  logger = logger.tag({ feature: 'tvs', module: 'tvs' })

  logger.info(
    `Tvs config loaded (${config.tvs.projects.length} projects, ${config.tvs.prices.length} price configs, ${config.tvs.amounts.length} amount configs)`,
  )

  const hourlyIndexer = new HourlyIndexer(logger, clock)

  const start = async () => {
    await hourlyIndexer.start()
  }

  return {
    start,
  }
}
