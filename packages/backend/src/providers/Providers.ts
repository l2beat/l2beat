import { Logger } from '@l2beat/backend-tools'
import { CoingeckoClient, HttpClient2, RetryHandler } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { Config } from '../config'
import { BlockProviders, initBlockProviders } from './BlockProviders'
import {
  CirculatingSupplyProviders,
  initCirculatingSupplyProviders,
} from './CirculatingSupplyProviders'
import { PriceProviders, initPriceProviders } from './PriceProviders'
import { TvlBlockProviders, initTvlBlockProviders } from './TvlBlockProviders'

export class Providers {
  block: BlockProviders | undefined
  price: PriceProviders | undefined
  circulatingSupply: CirculatingSupplyProviders | undefined
  tvlBlock: TvlBlockProviders | undefined
  coingeckoClient: CoingeckoClient

  constructor(
    readonly config: Config,
    readonly logger: Logger,
  ) {
    this.coingeckoClient = new CoingeckoClient(
      new HttpClient2(),
      config.coingeckoApiKey,
      RetryHandler.RELIABLE_API(logger),
    )
    this.block = config.activity
      ? initBlockProviders(config.activity)
      : undefined
    this.circulatingSupply = config.tvl
      ? initCirculatingSupplyProviders(this.coingeckoClient)
      : undefined
    this.tvlBlock = config.tvl ? initTvlBlockProviders(config.tvl) : undefined
    this.price = config.tvl
      ? initPriceProviders(this.coingeckoClient)
      : undefined
  }

  getBlockProviders() {
    assert(this.block, 'Block providers unintended access')
    return this.block
  }

  getPriceProviders() {
    assert(this.price, 'Price providers unintended access')
    return this.price
  }

  getCirculatingSupplyProviders() {
    assert(
      this.circulatingSupply,
      'Circulating Supply providers unintended access',
    )
    return this.circulatingSupply
  }

  getTvlBlockProviders() {
    assert(this.tvlBlock, 'TVL Block providers unintended access')
    return this.tvlBlock
  }
}
