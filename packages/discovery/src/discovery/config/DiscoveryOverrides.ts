import { EthereumAddress } from '@l2beat/shared-pure'

import { DiscoveryContract, RawDiscoveryConfig } from './RawDiscoveryConfig'

export type ContractOverrides = DiscoveryContract & {
  name?: string
  address: EthereumAddress
}

export class DiscoveryOverrides {
  private readonly nameToAddress = new Map<string, EthereumAddress>()

  constructor(
    public readonly config: Pick<RawDiscoveryConfig, 'names' | 'overrides'>,
    private readonly commonAddressNames: Record<string, string> = {},
  ) {
    for (const [address, name] of Object.entries(commonAddressNames ?? {})) {
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
      const commonName = this.commonAddressNames[address.toString()]
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

  *[Symbol.iterator](): IterableIterator<ContractOverrides> {
    for (const key of Object.keys(this.config.overrides ?? {})) {
      yield this.get(key)
    }
  }
}
