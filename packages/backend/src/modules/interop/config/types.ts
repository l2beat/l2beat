import type { EthereumAddress } from '@l2beat/shared-pure'

export interface InteropConfigPlugin {
  name: string
  getLatestConfig: () => Promise<Configs>
  generateNewConfig: (
    previous: Configs[] | undefined,
    latest: Configs[],
  ) => Configs[] | undefined
}

type Configs = AcrossNetwork[]

export interface AcrossNetwork {
  chainId: number
  chain: string
  spokePool: EthereumAddress
}
