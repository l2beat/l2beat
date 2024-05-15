import { Bytes, EthereumAddress } from '@l2beat/shared-pure'

export interface MulticallConfigEntry {
  sinceBlock: number
  batchSize: number
  address: EthereumAddress
  encodeBatch: (requests: MulticallRequest[]) => Bytes
  decodeBatch: (result: Bytes) => MulticallResponse[]
  isNativeBalanceSupported: boolean
}

export interface MulticallRequest {
  address: EthereumAddress
  data: Bytes
}

export interface MulticallResponse {
  success: boolean
  data: Bytes
}

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
