import type { AdjustCount } from '@l2beat/config'
import type { UnixTime } from '@l2beat/shared-pure'

interface SimpleActivityTransactionConfig<T extends string> {
  type: T
  url: string
  callsPerMinute: number
}

interface RpcActivityTransactionConfig {
  type: 'rpc'
  url: string
  callsPerMinute: number
  adjustCount?: AdjustCount
  startBlock?: number
}

interface StarkexActivityTransactionConfig {
  type: 'starkex'
  product: string[]
  sinceTimestamp: UnixTime
  resyncLastDays: number
}

export type ActivityTransactionConfig =
  | SimpleActivityTransactionConfig<'starknet'>
  | SimpleActivityTransactionConfig<'zksync'>
  | SimpleActivityTransactionConfig<'loopring'>
  | SimpleActivityTransactionConfig<'degate3'>
  | SimpleActivityTransactionConfig<'fuel'>
  | RpcActivityTransactionConfig
  | StarkexActivityTransactionConfig
