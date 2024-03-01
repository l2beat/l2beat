import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../config'
import { Database } from '../../peripherals/database/Database'
import { Clock } from '../../tools/Clock'
import { ApplicationModule } from '../ApplicationModule'
import { HourlyIndexer } from '../liveness/HourlyIndexer'

export function createTrackedTransactionsModule(
  config: Config,
  logger: Logger,
  database: Database,
  clock: Clock,
): ApplicationModule | undefined {
  const hourlyIndexer = new HourlyIndexer(logger, clock)
}
