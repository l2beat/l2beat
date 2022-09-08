import { EthereumAddress, UnixTime } from '@l2beat/types'

export interface Layer2Event {
  name: string
  abi: string
  emitter: EthereumAddress
  type: 'state' | 'data'
  sinceTimestamp: UnixTime
}
