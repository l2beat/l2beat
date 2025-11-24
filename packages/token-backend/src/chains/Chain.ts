import type { ChainRecord } from '@l2beat/database/dist/repositories/ChainRepository'
import { BlockscoutClient } from './clients/blockscout/BlockscoutClient'
import { EtherscanClient } from './clients/etherscan/EtherscanClient'
import { RpcClient } from './clients/rpc/RpcClient'

export interface ChainConfig {
  name: string
  chainId: number
  apis?: Array<{ type: string; url?: string }>
  etherscanApiKey?: string
}

export class Chain {
  public readonly rpc?: RpcClient
  public readonly etherscan?: EtherscanClient
  public readonly blockscout?: BlockscoutClient

  constructor(
    private readonly chainConfig: ChainRecord,
    config: {
      etherscanApiKey: string | undefined
    },
  ) {
    const rpcApi = chainConfig.apis?.find((api) => api.type === 'rpc')
    if (rpcApi?.url) {
      this.rpc = new RpcClient({ url: rpcApi.url })
    }

    const etherscanApi = chainConfig.apis?.find(
      (api) => api.type === 'etherscan',
    )
    if (etherscanApi && config.etherscanApiKey) {
      this.etherscan = new EtherscanClient(
        { apiKey: config.etherscanApiKey },
        chainConfig.chainId,
      )
    }

    const blockscoutApi = chainConfig.apis?.find(
      (api) => api.type === 'blockscout',
    )

    if (blockscoutApi) {
      this.blockscout = new BlockscoutClient({
        url: blockscoutApi.url,
      })
    }
  }

  get name(): string {
    return this.chainConfig.name
  }

  get chainId(): number {
    return this.chainConfig.chainId
  }
}
