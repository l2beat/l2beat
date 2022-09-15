interface AlchemyProvider {
  provider: 'alchemy'
  slug: string
}

interface JsonRpcProvider {
  provider: 'jsonRpc'
  url: string
}

export type Layer2Rpc = (AlchemyProvider | JsonRpcProvider) & {
  type: 'rpc'
  callsPerMinute?: number
}

export type Layer2Url = Layer2Rpc
