import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { CirculatingSupplyProviders } from '../../../providers/CirculatingSupplyProviders'
import { PriceProviders } from '../../../providers/PriceProviders'
import { Providers } from '../../../providers/Providers'
import { Clock } from '../../../tools/Clock'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { HourlyIndexer } from '../indexers/HourlyIndexer'
import { CirculatingSupplyService } from '../services/CirculatingSupplyService'
import { PriceService } from '../services/PriceService'
import { ValueService } from '../services/ValueService'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export class TvlDependencies {
  private readonly hourlyIndexer: HourlyIndexer
  private readonly syncOptimizer: SyncOptimizer
  private readonly indexerService: IndexerService
  private readonly valueService: ValueService
  private readonly priceService: PriceService
  private readonly priceProviders: PriceProviders
  private readonly circulatingSupplyProviders: CirculatingSupplyProviders
  private readonly circulatingSupplyService: CirculatingSupplyService

  constructor(
    readonly database: Database,
    readonly clock: Clock,
    readonly logger: Logger,
    readonly providers: Providers,
  ) {
    this.hourlyIndexer = new HourlyIndexer(logger, clock)
    this.syncOptimizer = new SyncOptimizer(this.clock)
    this.indexerService = new IndexerService(this.database)
    this.valueService = new ValueService(this.database)
    this.priceProviders = providers.getPriceProviders()
    this.priceService = new PriceService({
      priceProvider: this.priceProviders.getPriceProvider(),
    })
    this.circulatingSupplyProviders = providers.getCirculatingSupplyProviders()
    this.circulatingSupplyService = new CirculatingSupplyService({
      circulatingSupplyProvider:
        this.circulatingSupplyProviders.getCirculatingSupplyProvider(),
    })
  }

  getPriceService() {
    return this.priceService
  }

  getCirculatingSupplyService() {
    return this.circulatingSupplyService
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

  getValueService() {
    return this.valueService
  }
}
