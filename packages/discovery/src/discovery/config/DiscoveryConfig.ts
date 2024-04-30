import { EthereumAddress } from '../../utils/EthereumAddress'
import { Hash256 } from '../../utils/Hash256'
import { hashJson } from '../../utils/HashJson'
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

  get raw(): RawDiscoveryConfig {
    return this.config
  }

  get name(): string {
    return this.config.name
  }

  get names(): Record<string, string> {
    return this.config.names ?? {}
  }

  get chain(): string {
    return this.config.chain
  }

  get initialAddresses(): EthereumAddress[] {
    return this.config.initialAddresses
  }

  get maxAddresses(): number {
    return this.config.maxAddresses ?? 100
  }

  get maxDepth(): number {
    return this.config.maxDepth ?? 6
  }

  get sharedModules(): string[] {
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

  private getName(address: EthereumAddress): string | undefined {
    return this.config.names?.[address.toString()]
  }
}
