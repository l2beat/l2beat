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
  ) {
    for (const [address, name] of Object.entries(config.names ?? {})) {
      this.nameToAddress.set(name, EthereumAddress(address))
    }
  }

  get(nameOrAddress: string | EthereumAddress): ContractOverrides {
    let name: string | undefined
    let address: EthereumAddress | undefined

    if (EthereumAddress.check(nameOrAddress.toString())) {
      address = EthereumAddress(nameOrAddress.toString())
      name = this.config.names?.[address.toString()]
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

  *[Symbol.iterator]() {
    for (const key of Object.keys(this.config.overrides ?? {})) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      yield this.get(key)
    }
  }
}
