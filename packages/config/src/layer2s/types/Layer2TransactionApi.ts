import { UnixTime } from '@l2beat/shared-pure'

export type AssessCount = (count: number, blockNumber: number) => number

export interface RpcTransactionApi {
  type: 'rpc'
  url?: string
  callsPerMinute?: number
  assessCount?: AssessCount
  startBlock?: number
  timeout?: number
}

export interface StarknetTransactionApi {
  type: 'starknet'
  url: string
  callsPerMinute?: number
}

export interface AztecTransactionApi {
  type: 'aztec'
  url: string
  callsPerMinute?: number
}

export interface AztecConnectTransactionApi {
  type: 'aztecconnect'
  url: string
  callsPerMinute?: number
}

export interface ZksyncTransactionApi {
  type: 'zksync'
  callsPerMinute: number
}

export interface LoopringTransactionApi {
  type: 'loopring'
  callsPerMinute: number
}

export type StarkexProduct =
  | 'dydx'
  | 'sorare'
  | 'immutable'
  | 'myria'
  | 'deversifi'
  | 'apex'

export interface StarkexTransactionApi {
  type: 'starkex'
  product: StarkexProduct
  sinceTimestamp: UnixTime
  resyncLastDays: number
}

export type Layer2TransactionApi = { excludeFromActivityApi?: boolean } & (
  | RpcTransactionApi
  | StarkexTransactionApi
  | AztecTransactionApi
  | AztecConnectTransactionApi
  | StarknetTransactionApi
  | ZksyncTransactionApi
  | LoopringTransactionApi
)
