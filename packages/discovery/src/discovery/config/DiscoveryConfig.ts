import { hashJson } from '@l2beat/shared'
import type { EthereumAddress, Hash256 } from '@l2beat/shared-pure'

import { DiscoveryOutput } from '@l2beat/discovery-types'
import { ConfigReader } from './ConfigReader'
import { CommonAddressNames, DiscoveryOverrides } from './DiscoveryOverrides'
import type {
  DiscoveryContract,
  DiscoveryCustomType,
  RawDiscoveryConfig,
} from './RawDiscoveryConfig'
import { getDiscoveryConfigEntries } from './getDiscoveryConfigEntries'

// values inside this class should not be modified during the runtime
// this will result in the hash being different and break the update mechanism
export class DiscoveryConfig {
  readonly overrides: DiscoveryOverrides
  readonly sharedModuleDiscovery: DiscoveryOutput[]

  constructor(
    private readonly config: RawDiscoveryConfig,
    commonAddressNames: CommonAddressNames = {},
    private readonly globalTypes: Record<string, DiscoveryCustomType> = {},
    configReader: ConfigReader = new ConfigReader(),
  ) {
    this.overrides = new DiscoveryOverrides(config, commonAddressNames)
    this.sharedModuleDiscovery = Object.values(config.sharedModules ?? {}).map(
      (projectName) => {
        return configReader.readDiscovery(projectName, config.chain)
      },
    )
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

  // NOTE(radomski): name is for contract local types
  typesFor(name: string): Record<string, DiscoveryCustomType> {
    const result = structuredClone(this.globalTypes)
    for (const key of Object.keys(this.config.types ?? {})) {
      // biome-ignore lint/style/noNonNullAssertion: we know it's there
      result[key] = (this.config.types ?? {})[key]!
    }

    const contractLocal = this.overrides.get(name)?.types ?? {}
    for (const key of Object.keys(contractLocal)) {
      // biome-ignore lint/style/noNonNullAssertion: we know it's there
      result[key] = contractLocal[key]!
    }

    return result
  }

  get hash(): Hash256 {
    return hashJson(getDiscoveryConfigEntries(this.config))
  }

  isInSharedModules(address: EthereumAddress): boolean {
    return this.sharedModuleDiscovery.some((d) => {
      const addresses = d.contracts.map((c) => c.address)
      return addresses.includes(address)
    })
  }

  getContract(name: string): DiscoveryContract | undefined {
    return this.config.overrides?.[name ?? '']
  }
}
