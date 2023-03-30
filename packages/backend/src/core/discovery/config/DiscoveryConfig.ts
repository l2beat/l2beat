import { Hash256 } from '@l2beat/shared'

import { hashJson } from '../../../tools/hashJson'
import { getDiscoveryConfigEntries } from '../utils/getDiscoveryConfigEntries'
import { DiscoveryOverrides } from './DiscoveryOverrides'
import { RawDiscoveryConfig } from './RawDiscoveryConfig'

export class DiscoveryConfig {
  readonly overrides: DiscoveryOverrides

  constructor(private readonly config: RawDiscoveryConfig) {
    this.overrides = new DiscoveryOverrides(config)
  }

  get raw() {
    return this.config
  }

  get name() {
    return this.config.name
  }

  get initialAddresses() {
    return this.config.initialAddresses
  }

  get maxAddresses() {
    return this.config.maxAddresses ?? 100
  }

  get maxDepth() {
    return this.config.maxDepth ?? 6
  }

  get hash(): Hash256 {
    return hashJson(getDiscoveryConfigEntries(this.config))
  }
}
