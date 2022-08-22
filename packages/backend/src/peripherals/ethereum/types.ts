import { Bytes, EthereumAddress } from '@l2beat/types'

export type BlockTag = bigint | 'earliest' | 'latest' | 'pending'

export interface CallParameters {
  from?: EthereumAddress
  to: EthereumAddress
  gas?: bigint
  gasPrice?: bigint
  value?: bigint
  data?: Bytes
}
