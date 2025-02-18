import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { CirculatingSupplyProviders } from '../../../providers/CirculatingSupplyProviders'
import type { Clients } from '../../../providers/Clients'
import type { PriceProviders } from '../../../providers/PriceProviders'
import type { Providers } from '../../../providers/Providers'
import type { Clock } from '../../../tools/Clock'
import { HourlyIndexer } from '../../../tools/HourlyIndexer'
import { IndexerService } from '../../../tools/uif/IndexerService'
import type { BlockTimestampProvider } from '../services/BlockTimestampProvider'
import { CirculatingSupplyService } from '../services/CirculatingSupplyService'
import { PriceService } from '../services/PriceService'
import { ValueService } from '../services/ValueService'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export class TvlDependencies {
  readonly hourlyIndexer: HourlyIndexer
  readonly syncOptimizer: SyncOptimizer
  readonly indexerService: IndexerService
  readonly valueService: ValueService
  readonly priceService: PriceService
  readonly priceProviders: PriceProviders
  readonly circulatingSupplyProviders: CirculatingSupplyProviders
  readonly circulatingSupplyService: CirculatingSupplyService
  readonly clients: Clients

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
      database,
      logger,
    })
    this.circulatingSupplyProviders = providers.getCirculatingSupplyProviders()
    this.circulatingSupplyService = new CirculatingSupplyService({
      circulatingSupplyProvider:
        this.circulatingSupplyProviders.getCirculatingSupplyProvider(),
    })
    this.clients = providers.clients
  }

  getBlockTimestampProvider(chain: string): BlockTimestampProvider {
    return this.providers.block.getBlockTimestampProvider(chain)
  }
}
