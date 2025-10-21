import type { EthereumAddress } from '@l2beat/shared-pure'

export interface InteropNetworksPlugin {
  name: string
  getLatestNetworks: () => Promise<InteropNetworks>
  reconcileNetworks: (
    previous: InteropNetworks | undefined,
    latest: InteropNetworks,
  ) => InteropNetworks | 'not-changed'
}

export type InteropNetworks = AcrossNetwork[]

export interface AcrossNetwork {
  chainId: number
  chain: string
  spokePool: EthereumAddress
}
