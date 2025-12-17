import type { Logger } from '@l2beat/backend-tools'
import { EthRpcClient } from '@l2beat/shared'
import { Http } from '@l2beat/shared/build/clients2/Http'
import type { TokenDbClient } from '@l2beat/token-backend'
import type { InteropPlugin } from '../../plugins/types'

export class InteropPluginSyncer {
  constructor(
    private chains: { name: string; type: 'evm' }[],
    private plugins: InteropPlugin[],
    private tokenDbClient: TokenDbClient,
    private logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  async start() {
    const rpcClients = await this.createRpcClients(
      this.chains.map((c) => c.name),
    )

    for (const plugin of this.plugins) {
      if (!plugin.capturesEvents) {
        continue
      }
    }
  }

  async createRpcClients(chains: string[]) {
    const allChains = await this.tokenDbClient.chains.getAll.query()
    const result: { [chain: string]: EthRpcClient } = {}

    for (const chain of chains) {
      const chainData = allChains.find(
        (c) => c.name === chain || c.aliases?.includes(chain),
      )
      if (!chainData) {
        throw new Error(`Chain ${chain} is required but not found in TokenDB`)
      }

      const rpcData = chainData.apis?.find((api) => api.type === 'rpc')
      if (!rpcData) {
        throw new Error(`Chain ${chain} doesn't have RPC assigned in TokenDB`)
      }

      const http = new Http({
        logger: this.logger.for(EthRpcClient.name),
        maxCallsPerMinute: rpcData.callsPerMinute,
      })
      const rpcClient = new EthRpcClient(
        http,
        rpcData.url,
        `${EthRpcClient.name}:${chain}`,
      )
      result[chain] = rpcClient
    }

    return result
  }
}
