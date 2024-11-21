import { UnixTime } from '@l2beat/shared-pure'

interface BlockBasedApi {
  type: 'rpc' | 'starknet' | 'zksync' | 'loopring' | 'degate3' | 'fuel'
  url: string
  callsPerMinute: number
  retryStrategy: 'RELIABLE' | 'UNRELIABLE'
}

interface DayBasedApi {
  type: 'starkex'
  url: string
  apiKey: string
  callsPerMinute: number
  product: string[]
  sinceTimestamp: UnixTime
  resyncLastDays: number
  retryStrategy: 'RELIABLE' | 'UNRELIABLE'
}

export type BlockApi = BlockBasedApi | DayBasedApi
