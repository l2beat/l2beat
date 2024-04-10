import { EthereumAddress } from '@l2beat/shared-pure'

import { MulticallRequest, MulticallResponse } from './types'

export interface ERC20MulticallCodec {
  balance: {
    encode: (params: {
      holder: EthereumAddress
      token: EthereumAddress
    }) => MulticallRequest
    decode: (response: MulticallResponse) => bigint
  }
  totalSupply: {
    encode: (tokenAddress: EthereumAddress) => MulticallRequest
    decode: (response: MulticallResponse) => bigint
  }
}

export interface NativeAssetMulticallCodec {
  sinceBlock: number
  balance: {
    encode: (address: EthereumAddress) => MulticallRequest
    decode: (response: MulticallResponse) => bigint
  }
}
