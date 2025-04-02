import { hashJson } from '@l2beat/shared'
import type { EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import type { DiscoveryOutput } from '../output/types'
import { ConfigReader } from './ConfigReader'
import { type ContractConfig, createContractConfig } from './ContractConfig'
import {
  DiscoveryContract,
  type RawDiscoveryConfig,
} from './RawDiscoveryConfig'
import { getDiscoveryConfigEntries } from './getDiscoveryConfigEntries'
import { getDiscoveryPaths } from './getDiscoveryPaths'

export type ContractOverrides = DiscoveryContract & {
  name?: string
  address: EthereumAddress
}

// values inside this class should not be modified during the runtime
// this will result in the hash being different and break the update mechanism
export class DiscoveryConfig {
  readonly sharedModuleDiscovery: DiscoveryOutput[]

  constructor(
    private readonly config: RawDiscoveryConfig,
    configReader?: ConfigReader,
  ) {
    configReader ??= new ConfigReader(getDiscoveryPaths().discovery)
    this.sharedModuleDiscovery = (config.sharedModules ?? []).map(
      (projectName) => {
        return configReader.readDiscovery(projectName, config.chain)
      },
    )
  }

  for(address: EthereumAddress): ContractConfig {
    const overrides = this.getOverrides(address)

    return createContractConfig(
      overrides,
      structuredClone(this.config.types ?? {}),
      structuredClone(this.config.categories ?? {}),
    )
  }

  get raw(): RawDiscoveryConfig {
    return this.config
  }

  get name(): string {
    return this.config.name
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
    return this.config.sharedModules ?? []
  }

  get hash(): Hash256 {
    return hashJson(getDiscoveryConfigEntries(this.config))
  }

  isInSharedModules(address: EthereumAddress): boolean {
    return this.sharedModuleDiscovery.some((d) => {
      const addresses = d.entries.map((c) => c.address)
      return addresses.includes(address)
    })
  }

  private getOverrides(address: EthereumAddress): ContractOverrides {
    const name = (this.config.names ?? {})[address.toString()]
    const override =
      this.config.overrides?.[address.toString()] ?? DiscoveryContract.parse({})

    return { name, address, ...override }
  }
}
