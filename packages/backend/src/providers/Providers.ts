import { assert } from '@l2beat/shared-pure'
import { BlockProviders } from './BlockProviders'

export class Providers {
  constructor(private readonly block: BlockProviders | undefined) {}

  getBlockProviders() {
    assert(this.block, 'Block providers unintended access')
    return this.block
  }
}
