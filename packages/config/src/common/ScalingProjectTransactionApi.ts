import type { UnixTime } from '@l2beat/shared-pure'

export type AssessCount = (count: number, blockNumber: number) => number

export interface SimpleTransactionApi<T extends string> {
  type: T
  defaultUrl: string
  defaultCallsPerMinute?: number
}

export interface RpcTransactionApi {
  type: 'rpc'
  defaultUrl: string
  defaultCallsPerMinute?: number
  assessCount?: AssessCount
  startBlock?: number
}

export interface StarkexTransactionApi {
  type: 'starkex'
  product: string[]
  sinceTimestamp: UnixTime
  resyncLastDays?: number
}

export type ScalingProjectTransactionApi =
  | SimpleTransactionApi<'starknet'>
  | SimpleTransactionApi<'zksync'>
  | SimpleTransactionApi<'loopring'>
  | SimpleTransactionApi<'degate3'>
  | SimpleTransactionApi<'fuel'>
  | RpcTransactionApi
  | StarkexTransactionApi
