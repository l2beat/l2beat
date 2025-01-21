import type { Bytes, EthereumAddress } from '@l2beat/shared-pure'

export interface MulticallConfig {
  sinceBlock: number
  batchSize: number
  address: EthereumAddress
  encodeBatch: (requests: MulticallRequest[]) => Bytes
  decodeBatch: (result: Bytes) => MulticallResponse[]
}

export interface MulticallRequest {
  address: EthereumAddress
  data: Bytes
}

export interface MulticallResponse {
  success: boolean
  data: Bytes
}
