import { UnixTime } from '@l2beat/types'

export type AssessCountV2 = (count: number, blockNumber: number) => number

export interface RpcTransactionApiV2 {
  type: 'rpc'
  url?: string
  callsPerMinute?: number
  assessCount?: AssessCountV2
  startBlock?: number
  timeout?: number
}

export interface StarknetTransactionApiV2 {
  type: 'starknet'
  url: string
  callsPerMinute?: number
}

export interface AztecTransactionApiV2 {
  type: 'aztec'
  url: string
  callsPerMinute?: number
}
export interface ZksyncTransactionApiV2 {
  type: 'zksync'
  callsPerMinute: number
}

export interface LoopringTransactionApiV2 {
  type: 'loopring'
  callsPerMinute: number
}

export type StarkexProductV2 =
  | 'dydx'
  | 'sorare'
  | 'immutable'
  | 'myria'
  | 'deversifi'
export interface StarkexTransactionApiV2 {
  type: 'starkex'
  product: StarkexProductV2
  sinceTimestamp: UnixTime
}

export type Layer2TransactionApiV2 = { excludeFromActivityApi?: boolean } & (
  | RpcTransactionApiV2
  | StarkexTransactionApiV2
  | AztecTransactionApiV2
  | StarknetTransactionApiV2
  | ZksyncTransactionApiV2
  | LoopringTransactionApiV2
)
