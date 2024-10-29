import { assert } from '@l2beat/shared-pure'
import { Config } from '../config'
import { BlockProviders, initBlockProviders } from './BlockProviders'
import { PriceProviders, initPriceProviders } from './PriceProviders'

export class Providers {
  block: BlockProviders | undefined
  price: PriceProviders | undefined

  constructor(readonly config: Config) {
    this.block = config.activity
      ? initBlockProviders(config.activity)
      : undefined
    this.price = config.tvl ? initPriceProviders(config.tvl) : undefined
  }

  getBlockProviders() {
    assert(this.block, 'Block providers unintended access')
    return this.block
  }

  getPriceProviders() {
    assert(this.price, 'Price providers unintended access')
    return this.price
  }
}
