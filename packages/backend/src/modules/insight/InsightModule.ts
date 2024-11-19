import { Logger } from '@l2beat/backend-tools'
import { Config } from '../../config'
import { Peripherals } from '../../peripherals/Peripherals'
import { Providers } from '../../providers/Providers'
import { Clock } from '../../tools/Clock'
import { ApplicationModule } from '../ApplicationModule'
import { InsightPriceRefresher } from './InsightPriceRefresher'
import { createInsightRouter } from './InsightRouter'

export function createInsightModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  providers: Providers,
  clock: Clock,
): ApplicationModule | undefined {
  const insightConfig = config.insight

  if (!insightConfig) {
    logger.info('Insight module disabled')
    return
  }

  logger = logger.tag({ feature: 'insights', module: 'insights' })

  const pricesRefresher = new InsightPriceRefresher(
    peripherals.database,
    providers.coingeckoClient,
    clock,
    logger,
  )

  const start = () => {
    logger = logger.for('InsightModule')
    logger.info('Starting')
    pricesRefresher.start()
    logger.info('Started')
  }

  return {
    start,
    routers: [createInsightRouter(pricesRefresher)],
  }
}
