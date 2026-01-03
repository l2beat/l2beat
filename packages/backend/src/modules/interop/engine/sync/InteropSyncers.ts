import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { EthRpcClient, Http, UpsertMap } from '@l2beat/shared'
import type { LongChainName } from '@l2beat/shared-pure'
import type { ChainApi } from '../../../../config/chain/ChainApi'
import type { InteropPlugin } from '../../plugins/types'
import type { InteropEventStore } from '../capture/InteropEventStore'
import { InteropEventSyncer } from './InteropEventSyncer'
import { isPluginResyncable } from './isPluginResyncable'

export class InteropSyncers {
  private rpcClients: { [chain: string]: EthRpcClient } = {}

  private syncers = new UpsertMap<
    string,
    UpsertMap<LongChainName, InteropEventSyncer>
  >()

  constructor(
    eventPlugins: InteropPlugin[],
    enabledChains: LongChainName[],
    chainConfigs: ChainApi[],
    eventStore: InteropEventStore,
    db: Database,
    private readonly logger: Logger,
  ) {
    for (const plugin of eventPlugins) {
      if (!isPluginResyncable(plugin)) {
        continue
      }
      for (const chain of enabledChains) {
        const chainConfig = chainConfigs.find((c) => c.name === chain)
        if (!chainConfig) {
          throw new Error(`Missing configuration for chain ${chain}`)
        }
        const eventSyncer = new InteropEventSyncer(
          chain,
          plugin,
          this.getRpcClient(chainConfig),
          eventStore,
          db,
          logger,
        )
        this.syncers
          .getOrInsertComputed(plugin.name, () => new UpsertMap())
          .set(chain, eventSyncer)
      }
    }
  }

  start() {
    for (const chain of this.syncers.values()) {
      for (const syncer of chain.values()) {
        syncer.start()
      }
    }
  }

  getSyncer(
    plugin: string,
    chain: LongChainName,
  ): InteropEventSyncer | undefined {
    return this.syncers.get(plugin)?.get(chain)
  }

  private getRpcClient(chainConfig: ChainApi) {
    let client = this.rpcClients[chainConfig.name]
    if (!client) {
      const rpcConfig = chainConfig.blockApis.find((a) => a.type === 'rpc')
      if (!rpcConfig || rpcConfig.type !== 'rpc') {
        throw new Error(`Missing RPC config for chain ${chainConfig.name}`)
      }

      const rpcLogger = this.logger
        .for(EthRpcClient.name)
        .tag({ source: chainConfig.name })

      const http = new Http({
        logger: rpcLogger,
        maxCallsPerMinute: 120, // rpcConfig.callsPerMinute
      })

      client = new EthRpcClient(
        http,
        rpcConfig.url,
        `${EthRpcClient.name}:${chainConfig.name}`,
      )
      this.rpcClients[chainConfig.name] = client
    }
    return client
  }
}
