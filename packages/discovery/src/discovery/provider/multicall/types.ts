import { Bytes } from '../../../utils/Bytes'
import { EthereumAddress } from '../../../utils/EthereumAddress'

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
