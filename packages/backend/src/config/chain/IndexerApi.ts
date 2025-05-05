interface BlockscoutApi {
  type: 'blockscout'
  url: string
}

interface RoutescanApi {
  type: 'routescan'
  url: string
}

interface EtherscanApi {
  type: 'etherscan'
  apiKey: string
  url: string
  chainId: number
}

export type IndexerApi = BlockscoutApi | EtherscanApi | RoutescanApi
