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
}
