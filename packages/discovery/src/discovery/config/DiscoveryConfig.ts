import { EthereumAddress, Hash256, hashJson } from '@l2beat/shared-pure'

import { DiscoveryOverrides } from './DiscoveryOverrides'
import { getDiscoveryConfigEntries } from './getDiscoveryConfigEntries'
import { RawDiscoveryConfig } from './RawDiscoveryConfig'

// values inside this class should not be modified during the runtime
// this will result in the hash being different and break the update mechanism
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
