import { Logger } from '@l2beat/backend-tools'
import { Config } from '../../config'
import { Peripherals } from '../../peripherals/Peripherals'
import { Providers } from '../../providers/Providers'
import { Clock } from '../../tools/Clock'
import { ApplicationModule } from '../ApplicationModule'
import { AssetRisksPriceRefresher } from './AssetRisksPriceRefresher'
import { createAssetRisksRouter } from './AssetRisksRouter'

export function createAssetRisksModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  providers: Providers,
  clock: Clock,
): ApplicationModule | undefined {
  const assetRisksConfig = config.assetRisks
  if (!assetRisksConfig) {
    logger.info('Asset risks module disabled')
    return
  }

  const pricesRefresher = new AssetRisksPriceRefresher(
    peripherals.database,
    providers.coingeckoClient,
    clock,
    logger,
  )

  const start = () => {
    logger = logger.for('AssetRisksModule')
    logger.info('Starting')
    pricesRefresher.start()
    logger.info('Started')
  }

  return {
    start,
    routers: [createAssetRisksRouter(pricesRefresher)],
  }
}
