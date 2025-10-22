import type { EthereumAddress } from '@l2beat/shared-pure'

export interface InteropNetworksPlugin {
  name: string
  getLatestNetworks: () => Promise<InteropNetworks>
  reconcileNetworks: (
    previous: InteropNetworks | undefined,
    latest: InteropNetworks,
  ) => InteropNetworks | 'not-changed'
}

// TODO: resolve types
export type InteropNetworks = AcrossNetwork[] | LayerZeroV2Networks[]

export interface AcrossNetwork {
  chainId: number
  chain: string
  spokePool: EthereumAddress
}

export interface LayerZeroV2Networks {
  chainId: number
  eid: number
  chain: string
  endpointV2: string // fix issue with EthereumAddress
}
