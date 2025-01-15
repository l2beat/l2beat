import { EthereumAddress } from '@l2beat/shared-pure'

import { merge } from 'lodash'
import { DiscoveryContract, RawDiscoveryConfig } from './RawDiscoveryConfig'

export type ContractOverrides = DiscoveryContract & {
  name?: string
  address: EthereumAddress
}

export type CommonAddressNames = Record<string, Record<string, string>>

export class DiscoveryOverrides {
  private readonly nameToAddress = new Map<string, EthereumAddress>()
  private readonly commonAddressNames: Record<string, string>

  constructor(
    public readonly config: Pick<
      RawDiscoveryConfig,
      'names' | 'overrides' | 'chain'
    >,
    commonAddressNamesAllChains: CommonAddressNames = {},
  ) {
    const all = commonAddressNamesAllChains?.['all'] ?? {}
    const thisChain = commonAddressNamesAllChains?.[this.config.chain] ?? {}
    this.commonAddressNames = merge(all, thisChain)

    for (const [address, name] of Object.entries(this.commonAddressNames)) {
      this.nameToAddress.set(name, EthereumAddress(address))
    }
    for (const [address, name] of Object.entries(config.names ?? {})) {
      this.nameToAddress.set(name, EthereumAddress(address))
    }
  }

  get(nameOrAddress: string | EthereumAddress): ContractOverrides {
    let name: string | undefined
    let address: EthereumAddress | undefined

    if (EthereumAddress.check(nameOrAddress.toString())) {
      address = EthereumAddress(nameOrAddress.toString())
      const commonName = this.commonAddressNames?.[address.toString()]

      name = this.config.names?.[address.toString()] ?? commonName
    } else {
      address = this.nameToAddress.get(nameOrAddress.toString())
      name = nameOrAddress.toString()
    }

    if (address === undefined) {
      throw new Error(`Cannot resolve ${nameOrAddress.toString()}`)
    }

    const override =
      this.config.overrides?.[address.toString()] ??
      this.config.overrides?.[name ?? ''] ??
      {}

    return { name, address, ...override }
  }
}
