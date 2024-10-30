import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { PriceProviders } from '../../../providers/PriceProviders'
import { Providers } from '../../../providers/Providers'
import { Clock } from '../../../tools/Clock'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { HourlyIndexer } from '../indexers/HourlyIndexer'
import { PriceService } from '../services/PriceService'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export class TvlDependencies {
  private readonly priceProviders: PriceProviders
  private readonly hourlyIndexer: HourlyIndexer
  private readonly priceService: PriceService
  private readonly syncOptimizer: SyncOptimizer
  private readonly indexerService: IndexerService

  constructor(
    readonly database: Database,
    readonly clock: Clock,
    readonly logger: Logger,
    readonly providers: Providers,
  ) {
    this.priceProviders = providers.getPriceProviders()
    this.hourlyIndexer = new HourlyIndexer(logger, clock)
    this.syncOptimizer = new SyncOptimizer(this.clock)
    this.priceService = new PriceService({
      priceProvider: this.priceProviders.getPriceProvider(),
    })
    this.indexerService = new IndexerService(this.database)
  }

  getPriceService() {
    return this.priceService
  }

  getIndexerService() {
    return this.indexerService
  }

  getSyncOptimizer() {
    return this.syncOptimizer
  }

  getHourlyIndexer() {
    return this.hourlyIndexer
  }
}
