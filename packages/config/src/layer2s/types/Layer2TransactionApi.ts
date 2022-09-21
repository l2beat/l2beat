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

export type Layer2TransactionApi = AlchemyProvider | JsonRpcProvider
