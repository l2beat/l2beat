import { hashJson } from '@l2beat/shared'
import type { EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import type { DiscoveryOutput } from '../output/types'
import { type ColorConfig, ColorContract } from './ColorConfig'
import { ConfigReader } from './ConfigReader'
import {
  type ContractConfig,
  type ContractConfigColor,
  createContractConfig,
  createContractConfigColor,
} from './ContractConfig'
import {
  DiscoveryContract,
  type RawDiscoveryConfig,
} from './RawDiscoveryConfig'
import { getDiscoveryConfigEntries } from './getDiscoveryConfigEntries'
import { getDiscoveryPaths } from './getDiscoveryPaths'

export type ContractOverrides = DiscoveryContract & {
  address: EthereumAddress
}

// values inside this class should not be modified during the runtime
// this will result in the hash being different and break the update mechanism
export class DiscoveryConfig {
  readonly sharedModuleDiscovery: DiscoveryOutput[]

  constructor(
    private readonly config: RawDiscoveryConfig,
    private readonly colorConfig: ColorConfig, // TODO(radomski): I dont like this but we just want to get it working
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
    const override =
      this.config.overrides?.[address.toString()] ?? DiscoveryContract.parse({})

    const overrides = { address, ...override }

    return createContractConfig(
      overrides,
      structuredClone(this.config.types ?? {}),
    )
  }

  forColor(address: EthereumAddress): ContractConfigColor {
    const override =
      this.colorConfig.overrides?.[address.toString()] ??
      ColorContract.parse({})
    const name = (this.colorConfig.names ?? {})[address.toString()]

    const overrides = { address, name, ...override }

    const result = createContractConfigColor(
      overrides,
      structuredClone(this.colorConfig.categories ?? {}),
    )

    return result
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
