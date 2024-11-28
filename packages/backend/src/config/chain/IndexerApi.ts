interface BlockscoutApi {
  type: 'blockscout'
  url: string
}

interface EtherscanApi {
  type: 'etherscan'
  apiKey: string
  url: string
}

export type IndexerApi = BlockscoutApi | EtherscanApi
