import { UnixTime } from '@l2beat/types'

export type AssessCount = (count: number, blockNumber: number) => number

export interface RpcTransactionApi {
  type: 'rpc'
  url?: string
  callsPerMinute?: number
  assessCount?: AssessCount
  startBlock?: number
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

export type StarkexProduct =
  | 'dydx'
  | 'sorare'
  | 'immutable'
  | 'myria'
  | 'deversifi'

export interface StarkexTransactionApi {
  type: 'starkex'
  product: StarkexProduct
  sinceTimestamp: UnixTime
}

export type Layer2TransactionApi = { excludeFromActivityApi?: boolean } & (
  | RpcTransactionApi
  | StarkexTransactionApi
  | AztecTransactionApi
  | AztecConnectTransactionApi
)
