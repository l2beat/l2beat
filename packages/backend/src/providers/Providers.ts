import { assert } from '@l2beat/shared-pure'
import { Config } from '../config'
import { BlockProviders, initBlockProviders } from './BlockProviders'

export class Providers {
  block: BlockProviders | undefined

  constructor(readonly config: Config) {
    this.block = config.activity
      ? initBlockProviders(config.activity)
      : undefined
  }

  getBlockProviders() {
    assert(this.block, 'Block providers unintended access')
    return this.block
  }
}
