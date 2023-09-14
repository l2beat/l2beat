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
