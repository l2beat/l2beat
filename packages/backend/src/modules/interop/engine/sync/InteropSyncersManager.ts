import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { EthRpcClient, Http, UpsertMap } from '@l2beat/shared'
import type { Block, Log, LongChainName } from '@l2beat/shared-pure'
import type { ChainApi } from '../../../../config/chain/ChainApi'
import type { BlockProcessor } from '../../../types'
import type { PluginCluster } from '../../plugins'
import { isPluginResyncable } from '../../plugins/types'
import type { InteropEventStore } from '../capture/InteropEventStore'
import { InteropEventSyncer } from './InteropEventSyncer'
import { ResyncWipeCoordinator } from './ResyncWipeCoordinator'

export type PluginSyncStatus = {
  pluginName: string
  chain: string
  syncMode?: string
  toBlock?: bigint
  toTimestamp?: number
  lastError?: string
  resyncRequestedFrom?: number
}

export class InteropSyncersManager {
  private rpcClients: { [chain: string]: EthRpcClient } = {}

  private syncers = new UpsertMap<
    string, // plugin cluster name
    UpsertMap<LongChainName, InteropEventSyncer>
  >()

  constructor(
    private readonly pluginClusters: PluginCluster[],
    enabledChains: LongChainName[],
    chainConfigs: ChainApi[],
    eventStore: InteropEventStore,
    private readonly db: Database,
    private readonly logger: Logger,
  ) {
    for (const cluster of pluginClusters) {
      const resyncablePlugins = cluster.plugins.filter(isPluginResyncable)
      if (resyncablePlugins.length === 0) {
        continue // skip clusters of non-resyncable plugins
      }
      if (resyncablePlugins.length !== cluster.plugins.length) {
        throw new Error(
          `Cluster of plugins '${cluster.name} contains mix of non- and resyncable plugins. They must all be the same kind.`,
        )
      }
      const resyncCoordinator = new ResyncWipeCoordinator(
        cluster.name,
        enabledChains,
        logger.for(ResyncWipeCoordinator.name),
      )
      for (const chain of enabledChains) {
        const chainConfig = chainConfigs.find((c) => c.name === chain)
        if (!chainConfig) {
          throw new Error(`Missing configuration for chain ${chain}`)
        }

        const eventSyncer = new InteropEventSyncer(
          chain,
          { name: cluster.name, plugins: resyncablePlugins },
          this.getRpcClient(chainConfig),
          eventStore,
          db,
          logger,
          resyncCoordinator,
        )
        this.syncers
          .getOrInsertComputed(cluster.name, () => new UpsertMap())
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

  async processNewestBlock(chain: LongChainName, block: Block, logs: Log[]) {
    for (const v of this.syncers.values()) {
      const syncer = v.get(chain)
      if (syncer) {
        await syncer.processNewestBlock(block, logs)
      }
    }
  }

  getBlockProcessor(chain: LongChainName): BlockProcessor {
    return {
      chain,
      processBlock: (block, logs) =>
        this.processNewestBlock(chain, block, logs),
    }
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

  async getPluginSyncStatuses(): Promise<PluginSyncStatus[]> {
    const syncedRanges = await this.db.interopPluginSyncedRange.getAll()
    const syncStates = await this.db.interopPluginSyncState.getAll()
    const stateByKey = new Map(
      syncStates.map((state) => [`${state.pluginName}:${state.chain}`, state]),
    )
    const seen = new Set<string>()
    const rows: PluginSyncStatus[] = []

    for (const range of syncedRanges) {
      const key = `${range.pluginName}:${range.chain}`
      const syncer = this.getSyncer(
        range.pluginName,
        range.chain as LongChainName,
      )
      const state = stateByKey.get(key)
      seen.add(key)
      rows.push({
        pluginName: range.pluginName,
        chain: range.chain,
        syncMode: `${syncer?.state.name}-${syncer?.state.status}`,
        toBlock: range.toBlock,
        toTimestamp: range.toTimestamp,
        lastError: state?.lastError ?? undefined,
        resyncRequestedFrom: state?.resyncRequestedFrom ?? undefined,
      })
    }

    for (const state of syncStates) {
      const key = `${state.pluginName}:${state.chain}`
      if (seen.has(key)) {
        continue
      }
      seen.add(key)
      const syncer = this.getSyncer(
        state.pluginName,
        state.chain as LongChainName,
      )
      rows.push({
        pluginName: state.pluginName,
        chain: state.chain,
        syncMode: `${syncer?.state.name}-${syncer?.state.status}`,
        lastError: state.lastError ?? undefined,
      })
    }

    for (const chain of this.syncers.values()) {
      for (const syncer of chain.values()) {
        const clusterName = syncer.cluster.name
        const key = `${clusterName}:${syncer.chain}`
        if (seen.has(key)) {
          continue
        }
        seen.add(key)
        rows.push({
          pluginName: clusterName,
          chain: syncer.chain,
          syncMode: `${syncer?.state.name}-${syncer?.state.status}`,
        })
      }
    }

    rows.sort((a, b) => {
      const pluginCompare = a.pluginName.localeCompare(b.pluginName)
      if (pluginCompare !== 0) {
        return pluginCompare
      }
      return a.chain.localeCompare(b.chain)
    })

    return rows
  }
}
