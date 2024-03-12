import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../config'
import { Clock } from '../../tools/Clock'
import { ApplicationModule } from '../ApplicationModule'
import { createTvl2StatusRouter } from './api/Tvl2StatusRouter'

export function createTvl2Module(
  config: Config,
  logger: Logger,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.tvl2) {
    logger.info('Tvl2Module disabled')
    return
  }

  const statusRouter = createTvl2StatusRouter(config.tvl2, clock)

  const start = () => {
    logger = logger.for('Tvl2Module')
    logger.info('Started')
  }

  return {
    routers: [statusRouter],
    start,
  }
}
