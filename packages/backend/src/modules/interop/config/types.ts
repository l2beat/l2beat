import type { EthereumAddress } from '@l2beat/shared-pure'

export interface InteropConfigPlugin {
  name: string
  getLatestConfig: () => Promise<InteropConfig>
  generateNewConfig: (
    previous: InteropConfig | undefined,
    latest: InteropConfig,
  ) => InteropConfig | 'not-changed'
}

export type InteropConfig = AcrossNetwork[]

export interface AcrossNetwork {
  chainId: number
  chain: string
  spokePool: EthereumAddress
}
