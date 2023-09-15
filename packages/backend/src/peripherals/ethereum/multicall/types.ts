import { Bytes, EthereumAddress } from '@l2beat/shared-pure'

export interface MulticallConfigEntry {
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
