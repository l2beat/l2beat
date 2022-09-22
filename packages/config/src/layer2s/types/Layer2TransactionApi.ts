import { UnixTime } from '@l2beat/types'

interface AlchemyProvider {
  type: 'rpc'
  provider: 'alchemy'
  networkName: string
  callsPerMinute?: number
}

interface JsonRpcProvider {
  type: 'rpc'
  provider: 'jsonRpc'
  url: string
  callsPerMinute?: number
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
