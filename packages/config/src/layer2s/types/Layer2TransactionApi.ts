import { UnixTime } from '@l2beat/types'

export type AssessCount = (count: number, blockNumber: number) => number

interface AlchemyProvider {
  type: 'rpc'
  provider: 'alchemy'
  networkName: string
  callsPerMinute?: number
  assessCount?: AssessCount
}

interface JsonRpcProvider {
  type: 'rpc'
  provider: 'jsonRpc'
  url: string
  callsPerMinute?: number
  assessCount?: AssessCount
}

export type RpcTransactionApi = AlchemyProvider | JsonRpcProvider

export type StarkexProduct =
  | 'dydx'
  | 'sorare'
  | 'immutable'
  | 'myria'
  | 'diversify'
interface StarkexApi {
  type: 'starkex'
  product: StarkexProduct
  sinceTimestamp: UnixTime
}

export type Layer2TransactionApi = RpcTransactionApi | StarkexApi
