import { EthereumAddress, Hash256 } from '@l2beat/shared'

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

  get sharedModules() {
    return this.config.sharedModules
      ? Object.values(this.config.sharedModules)
      : []
  }

  get hash(): Hash256 {
    return hashJson(getDiscoveryConfigEntries(this.config))
  }

  getSharedModule(address: EthereumAddress): string | undefined {
    const name = this.getName(address)
    if (!name) {
      return
    }
    return this.config.sharedModules?.[name]
  }

  private getName(address: EthereumAddress) {
    return this.config.names?.[address.toString()]
  }
}
