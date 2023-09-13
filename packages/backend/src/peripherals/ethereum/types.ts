import { Bytes, EthereumAddress } from '@l2beat/shared-pure'

export type BlockTag = number | 'earliest' | 'latest' | 'pending'

export interface CallParameters {
  from?: EthereumAddress
  to: EthereumAddress
  gas?: bigint
  gasPrice?: bigint
  value?: bigint
  data?: Bytes
}

export interface MulticallConfigEntry {
  blockNumber: number
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
