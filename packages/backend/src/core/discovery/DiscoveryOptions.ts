import { EthereumAddress } from '@l2beat/types'

export interface DiscoveryOptions {
  skipAddresses: EthereumAddress[]
  // address -> method names
  skipMethods: Record<string, string[] | undefined>
  // address -> abi
  addAbis: Record<string, string[] | undefined>
}
