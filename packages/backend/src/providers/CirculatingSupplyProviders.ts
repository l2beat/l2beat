import { Logger } from '@l2beat/backend-tools'
import {
  CirculatingSupplyProvider,
  type CoingeckoClient,
  CoingeckoQueryService,
} from '@l2beat/shared'

export class CirculatingSupplyProviders {
  private readonly circulatingSupplyProvider: CirculatingSupplyProvider

  constructor(private readonly coingeckoQueryService: CoingeckoQueryService) {
    this.circulatingSupplyProvider = new CirculatingSupplyProvider(
      coingeckoQueryService,
    )
  }

  getCirculatingSupplyProvider() {
    return this.circulatingSupplyProvider
  }
}

export function initCirculatingSupplyProviders(
  coingeckoClient: CoingeckoClient,
): CirculatingSupplyProviders {
  const logger = Logger.SILENT
  const coingeckoQueryService = new CoingeckoQueryService(
    coingeckoClient,
    logger.tag({ tag: 'circulatingSupply' }),
  )

  return new CirculatingSupplyProviders(coingeckoQueryService)
}
