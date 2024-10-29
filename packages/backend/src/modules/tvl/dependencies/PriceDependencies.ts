import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { PriceProviders } from '../../../providers/PriceProviders'
import { Providers } from '../../../providers/Providers'
import { Clock } from '../../../tools/Clock'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { HourlyIndexer } from '../indexers/HourlyIndexer'
import { PriceService } from '../services/PriceService'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export class PriceDependencies {
  private readonly priceProviders: PriceProviders

  constructor(
    readonly database: Database,
    readonly clock: Clock,
    readonly logger: Logger,
    readonly providers: Providers,
  ) {
    this.priceProviders = providers.getPriceProviders()
  }

  getPriceService() {
    return new PriceService({
      priceProvider: this.priceProviders.getPriceProvider(),
    })
  }

  getIndexerService() {
    return new IndexerService(this.database)
  }

  getSyncOptimizer() {
    return new SyncOptimizer(this.clock)
  }

  getHourlyIndexer() {
    return new HourlyIndexer(this.logger, this.clock)
  }
}
