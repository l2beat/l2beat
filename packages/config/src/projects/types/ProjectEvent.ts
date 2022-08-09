import { EthereumAddress } from '@l2beat/common'

export interface ProjectEvent {
  abi: string
  name: string
  emitter: EthereumAddress
  type: 'state' | 'data'
}
