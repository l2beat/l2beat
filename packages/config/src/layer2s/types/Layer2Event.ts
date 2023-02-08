import { EthereumAddress, UnixTime } from '@l2beat/shared'

export interface Layer2Event {
  name: string
  abi: string
  emitter: EthereumAddress
  type: 'state' | 'data'
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}
