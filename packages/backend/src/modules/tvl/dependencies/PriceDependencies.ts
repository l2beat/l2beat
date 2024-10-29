import { Database } from '@l2beat/database'
import { PriceProviders } from '../../../providers/PriceProviders'
import { Providers } from '../../../providers/Providers'
import { PriceService } from '../services/PriceService'

export class PriceDependencies {
  private readonly priceProviders: PriceProviders

  constructor(
    readonly database: Database,
    providers: Providers,
  ) {
    this.priceProviders = providers.getPriceProviders()
  }

  getPriceService() {
    return new PriceService({
      priceProvider: this.priceProviders.getPriceProvider(),
    })
  }
}
