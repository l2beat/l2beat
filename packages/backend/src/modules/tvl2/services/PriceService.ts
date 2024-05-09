import { Logger } from '@l2beat/backend-tools'

import { CoingeckoQueryService } from '@l2beat/shared'

export interface PriceServiceDependencies {
  readonly coingeckoQueryService: CoingeckoQueryService
  logger: Logger
}

export class PriceService {
  constructor(private readonly $: PriceServiceDependencies) {
    this.$.logger = $.logger.for(this)
  }
}
