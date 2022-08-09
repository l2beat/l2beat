import { EthereumAddress } from '@l2beat/common'

export interface ProjectEvent {
  name: string
  abi: string
  emitter: EthereumAddress
  type: 'state' | 'data'
}
