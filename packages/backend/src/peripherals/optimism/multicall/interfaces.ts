import { Bytes, EthereumAddress } from '@l2beat/shared-pure'

export interface MulticallRequest {
  address: EthereumAddress
  data: Bytes
}

export interface MulticallResponse {
  success: boolean
  data: Bytes
}

export interface MulticallEncoder {
  encode: (requests: MulticallRequest[]) => Bytes
  decode: (response: Bytes) => MulticallResponse[]
}
