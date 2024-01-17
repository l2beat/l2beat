import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export interface MulticallContractConfig {
  address: EthereumAddress
  sinceBlock: number
  batchSize: number
  version: '1' | '2' | '3' | 'optimism'
}

export interface ChainConfig {
  /**
   * A lowercase a-z0-9 name of the chain. Used for uniquely identifying the
   * chain in configuration.
   */
  devId: string
  chainId: number
  explorerUrl?: string
  explorerApi?: {
    url: string
    type: 'etherscan' | 'routescan'
  }
  /**
   * Setting this value for a chain does not always equal to grabbing the
   * timestamp of the first block. For example Optimism had block 0 on
   * January 2021 but the block 1 on November 2021.
   */
  minTimestampForTvl?: UnixTime
  multicallContracts?: MulticallContractConfig[]
}
