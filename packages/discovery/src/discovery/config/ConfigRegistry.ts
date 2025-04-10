import { hashJson } from '@l2beat/shared'
import type { EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import type { DiscoveryOutput } from '../output/types'
import { ColorConfig } from './ColorConfig'
import { ConfigReader } from './ConfigReader'
import { type ContractConfig, createContractConfig } from './ContractConfig'
import { DiscoveryContract, RawDiscoveryConfig } from './RawDiscoveryConfig'
import { getDiscoveryConfigEntries } from './getDiscoveryConfigEntries'
import { getDiscoveryPaths } from './getDiscoveryPaths'

// values inside this class should not be modified during the runtime
// this will result in the hash being different and break the update mechanism
export class ConfigRegistry {
  readonly sharedModuleDiscovery: DiscoveryOutput[]
  readonly config: RawDiscoveryConfig
  readonly colorConfig: ColorConfig

  constructor(
    readonly unparsedConfig: object,
    configReader?: ConfigReader,
  ) {
    this.config = RawDiscoveryConfig.parse(unparsedConfig)
    this.colorConfig = ColorConfig.parse(unparsedConfig)

    configReader ??= new ConfigReader(getDiscoveryPaths().discovery)
    this.sharedModuleDiscovery = (this.config.sharedModules ?? []).map(
      (projectName) => {
        return configReader.readDiscovery(projectName, this.config.chain)
      },
    )
  }

  for(address: EthereumAddress): ContractConfig {
    const override =
      this.config.overrides?.[address.toString()] ?? DiscoveryContract.parse({})

    const overrides = { address, ...override }

    return createContractConfig(
      overrides,
      structuredClone(this.config.types ?? {}),
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
}
