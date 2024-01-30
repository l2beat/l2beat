import { AssessCount } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'

export interface SimpleActivityTransactionConfig<T extends string> {
  type: T
  url: string
  callsPerMinute: number
}

export interface RpcActivityTransactionConfig {
  type: 'rpc'
  url: string
  callsPerMinute: number
  assessCount?: AssessCount
  startBlock?: number
}

export interface StarkexActivityTransactionConfig {
  type: 'starkex'
  product: string[]
  sinceTimestamp: UnixTime
  resyncLastDays: number
}

export type ActivityTransactionConfig =
  | SimpleActivityTransactionConfig<'starknet'>
  | SimpleActivityTransactionConfig<'aztec'>
  | SimpleActivityTransactionConfig<'zksync'>
  | SimpleActivityTransactionConfig<'loopring'>
  | RpcActivityTransactionConfig
  | StarkexActivityTransactionConfig
