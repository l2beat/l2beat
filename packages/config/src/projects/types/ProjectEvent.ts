import { EthereumAddress, UnixTime } from '@l2beat/types'

export interface ProjectEvent {
  name: string
  abi: string
  emitter: EthereumAddress
  type: 'state' | 'data'
  sinceTimestamp: UnixTime
}
