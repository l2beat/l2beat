import { Bytes, EthereumAddress } from '@l2beat/shared-pure'

import { MulticallRequest } from './types'

export interface ERC20MulticallCodec {
  balance: {
    encode: (
      holder: EthereumAddress,
      token: EthereumAddress,
    ) => MulticallRequest
    decode: (response: Bytes) => bigint
  }
  totalSupply: {
    encode: (tokenAddress: EthereumAddress) => MulticallRequest
    decode: (response: Bytes) => bigint
  }
}

export interface NativeAssetMulticallCodec {
  sinceBlock: number
  balance: {
    encode: (address: EthereumAddress) => MulticallRequest
    decode: (response: Bytes) => bigint
  }
}
