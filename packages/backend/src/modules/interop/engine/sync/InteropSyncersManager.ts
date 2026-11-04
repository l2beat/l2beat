import type { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  InteropPluginSyncedRangeRecord,
  InteropPluginSyncStateRecord,
} from '@l2beat/database'
import {
  EthRpcClient,
  Http,
  type RpcMetricsAggregator,
  UpsertMap,
} from '@l2beat/shared'
import type { Block, Log, LongChainName, UnixTime } from '@l2beat/shared-pure'
import type { ChainApi } from '../../../../config/chain/ChainApi'
import type { BlockProcessor } from '../../../types'
import type { PluginCluster } from '../../plugins'
import { isPluginResyncable } from '../../plugins/types'
import type { InteropEventStore } from '../capture/InteropEventStore'
import { InteropDataCleaner } from './InteropDataCleaner'
import { InteropEventSyncer } from './InteropEventSyncer'

export type BlockProcessingStat = {
  cluster: string
  chain: string
  totalMs: number
  cpuMs: number
  count: number
  avgMs: number
  avgCpuMs: number
}

export type PluginChainStatus = 'active' | 'disabled' | 'stale'

export type PluginSyncStatus = {
  pluginName: string
  chain: string
  chainStatus: PluginChainStatus
  syncMode?: string
  toBlock?: bigint
  toTimestamp?: number
  lastError?: string
  resyncRequestedFrom?: number
  isLagging: boolean
}

/** Plugin name -> chains on which its captured data lags. */
export type LaggingChainsByPlugin = Map<string, Set<string>>

type LaggingSyncer = { syncer: InteropEventSyncer } & (
  | { reason: 'pendingWipeOrResync' | 'noSyncedRange' }
  | { reason: 'behind'; toTimestamp: UnixTime }
)

interface SyncerIndexes {
  syncedRanges: InteropPluginSyncedRangeRecord[]
  syncStates: InteropPluginSyncStateRecord[]
  rangeByKey: Map<string, InteropPluginSyncedRangeRecord>
  stateByKey: Map<string, InteropPluginSyncStateRecord>
}

export class InteropSyncersManager {
  private rpcClients: { [chain: string]: EthRpcClient } = {}

  private syncers = new UpsertMap<
    string, // plugin cluster name
    UpsertMap<LongChainName, InteropEventSyncer>
  >()
  private dataCleaners: InteropDataCleaner[] = []
  private readonly knownChains: Set<string>

  constructor(
    readonly pluginClusters: PluginCluster[],
    enabledChains: LongChainName[],
    knownChains: string[],
    chainConfigs: ChainApi[],
    eventStore: InteropEventStore,
    private readonly db: Database,
    private readonly logger: Logger,
    private readonly rpcMetricsAggregator: RpcMetricsAggregator,
  ) {
    this.knownChains = new Set(knownChains)
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

      const clusterSyncers: InteropEventSyncer[] = []

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
        )
        clusterSyncers.push(eventSyncer)
        this.syncers
          .getOrInsertComputed(cluster.name, () => new UpsertMap())
          .set(chain, eventSyncer)
      }

      if (clusterSyncers.length > 0) {
        this.dataCleaners.push(
          new InteropDataCleaner(
            { name: cluster.name, plugins: resyncablePlugins },
            clusterSyncers,
            eventStore,
            db,
            logger,
          ),
        )
      }
    }
  }

  start() {
    for (const chain of this.syncers.values()) {
      for (const syncer of chain.values()) {
        syncer.start()
      }
    }
    for (const cleaner of this.dataCleaners) {
      cleaner.start()
    }
  }

  /**
   * Chains, per plugin, on which captured data cannot back the snapshot at
   * `target`. Every plugin of a lagging cluster syncer lags with it.
   */
  async getLaggingChainsByPlugin(
    target: UnixTime,
    tolerance: number,
  ): Promise<LaggingChainsByPlugin> {
    const lagging = this.findLaggingSyncers(
      await this.loadSyncerIndexes(),
      target,
      tolerance,
    )
    this.logLaggingSyncers(lagging, target, target - tolerance)

    const result: LaggingChainsByPlugin = new Map()
    for (const { syncer } of lagging) {
      for (const plugin of syncer.cluster.plugins) {
        const chains = result.get(plugin.name) ?? new Set()
        chains.add(syncer.chain)
        result.set(plugin.name, chains)
      }
    }
    return result
  }

  private async loadSyncerIndexes(): Promise<SyncerIndexes> {
    const [syncedRanges, syncStates] = await Promise.all([
      this.db.interopPluginSyncedRange.getAll(),
      this.db.interopPluginSyncState.getAll(),
    ])
    return {
      syncedRanges,
      syncStates,
      rangeByKey: new Map(
        syncedRanges.map((r) => [syncerKey(r.pluginName, r.chain), r]),
      ),
      stateByKey: new Map(
        syncStates.map((s) => [syncerKey(s.pluginName, s.chain), s]),
      ),
    }
  }

  /**
   * Judged by the persisted synced range rather than instantaneous state so
   * transient errors and brief catch-ups don't count as lagging. A pending
   * wipe/resync lags too: its range still looks recent while the underlying
   * data is about to be deleted or rebuilt. Syncers not registered in this
   * manager are never considered.
   */
  private findLaggingSyncers(
    { rangeByKey, stateByKey }: SyncerIndexes,
    target: UnixTime,
    tolerance: number,
  ): LaggingSyncer[] {
    const threshold = target - tolerance
    const lagging: LaggingSyncer[] = []

    for (const byChain of this.syncers.values()) {
      for (const syncer of byChain.values()) {
        const key = syncerKeyOf(syncer)
        const state = stateByKey.get(key)
        const range = rangeByKey.get(key)
        if (state?.wipeRequired || state?.resyncRequestedFrom != null) {
          lagging.push({ syncer, reason: 'pendingWipeOrResync' })
        } else if (!range) {
          lagging.push({ syncer, reason: 'noSyncedRange' })
        } else if (range.toTimestamp < threshold) {
          lagging.push({
            syncer,
            reason: 'behind',
            toTimestamp: range.toTimestamp,
          })
        }
      }
    }

    return lagging
  }

  /** A missing range is an error because it is suspicious outside cold start. */
  private logLaggingSyncers(
    lagging: LaggingSyncer[],
    target: UnixTime,
    threshold: UnixTime,
  ) {
    const missing: string[] = []
    const stale: { syncer: string; toTimestamp: UnixTime }[] = []
    const pending: string[] = []
    for (const s of lagging) {
      const syncer = syncerKeyOf(s.syncer)
      if (s.reason === 'noSyncedRange') missing.push(syncer)
      else if (s.reason === 'behind')
        stale.push({ syncer, toTimestamp: s.toTimestamp })
      else pending.push(syncer)
    }

    if (missing.length > 0) {
      this.logger.error('Syncers have no synced range', { target, missing })
    }
    if (stale.length > 0) {
      this.logger.warn('Syncers are behind the aggregation threshold', {
        target,
        threshold,
        stale,
      })
    }
    if (pending.length > 0) {
      this.logger.warn('Syncers have a pending wipe or resync', { pending })
    }
  }

  getSyncer(
    plugin: string,
    chain: LongChainName,
  ): InteropEventSyncer | undefined {
    return this.syncers.get(plugin)?.get(chain)
  }

  private getChainStatus(pluginName: string, chain: string): PluginChainStatus {
    if (this.getSyncer(pluginName, chain as LongChainName)) {
      return 'active'
    }
    if (this.syncers.has(pluginName) && this.knownChains.has(chain)) {
      return 'disabled'
    }
    return 'stale'
  }

  getChainsForPlugin(pluginName: string): LongChainName[] {
    const chainMap = this.syncers.get(pluginName)
    if (!chainMap) return []
    return Array.from(chainMap.keys())
  }

  async processNewestBlock(chain: LongChainName, block: Block, logs: Log[]) {
    const results = await Promise.allSettled(
      Array.from(this.syncers.values())
        .map((syncersByChain) => syncersByChain.get(chain))
        .filter((syncer): syncer is InteropEventSyncer => syncer !== undefined)
        .map((syncer) => syncer.processNewestBlock(block, logs)),
    )

    const rejected = results.find((result) => result.status === 'rejected')
    if (rejected?.status === 'rejected') {
      throw rejected.reason
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
        .tag({ source: chainConfig.name, chain: chainConfig.name })

      const http = new Http({
        logger: rpcLogger,
        maxCallsPerMinute: 500, // rpcConfig.callsPerMinute
      })

      client = new EthRpcClient(
        http,
        rpcConfig.url,
        undefined,
        undefined,
        this.rpcMetricsAggregator.createRecorder({
          rpcChain: chainConfig.name,
          rpcClient: EthRpcClient.name,
        }),
        { maxBatchSize: rpcConfig.maxBatchSize, logger: rpcLogger },
      )
      this.rpcClients[chainConfig.name] = client
    }
    return client
  }

  getBlockProcessingStats() {
    const result: BlockProcessingStat[] = []
    for (const chainMap of this.syncers.values()) {
      for (const syncer of chainMap.values()) {
        const stats = syncer.blockProcessingStats.get()
        result.push({
          cluster: syncer.cluster.name,
          chain: syncer.chain,
          ...stats,
        })
      }
    }
    return result
  }

  /**
   * `aggregationTarget` and `freshnessTolerance` should mirror what the
   * aggregating indexer passes to `getLaggingChainsByPlugin` so that
   * `isLagging` reflects whether the indexer treats a row's lanes as stale:
   * carried forward from the previous snapshot, or saved partial when there
   * is nothing to carry.
   */
  async getPluginSyncStatuses(
    aggregationTarget: UnixTime,
    freshnessTolerance: number,
  ): Promise<PluginSyncStatus[]> {
    const indexes = await this.loadSyncerIndexes()
    const { syncedRanges, syncStates, stateByKey } = indexes
    const lagging = new Set(
      this.findLaggingSyncers(
        indexes,
        aggregationTarget,
        freshnessTolerance,
      ).map((s) => syncerKeyOf(s.syncer)),
    )
    const seen = new Set<string>()
    const rows: PluginSyncStatus[] = []

    for (const range of syncedRanges) {
      const key = syncerKey(range.pluginName, range.chain)
      const syncer = this.getSyncer(
        range.pluginName,
        range.chain as LongChainName,
      )
      const state = stateByKey.get(key)
      seen.add(key)
      rows.push({
        pluginName: range.pluginName,
        chain: range.chain,
        chainStatus: this.getChainStatus(range.pluginName, range.chain),
        syncMode: formatSyncMode(syncer),
        toBlock: range.toBlock,
        toTimestamp: range.toTimestamp,
        lastError: state?.lastError ?? undefined,
        resyncRequestedFrom: state?.resyncRequestedFrom ?? undefined,
        isLagging: lagging.has(key),
      })
    }

    for (const state of syncStates) {
      const key = syncerKey(state.pluginName, state.chain)
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
        chainStatus: this.getChainStatus(state.pluginName, state.chain),
        syncMode: formatSyncMode(syncer),
        lastError: state.lastError ?? undefined,
        isLagging: lagging.has(key),
      })
    }

    for (const chain of this.syncers.values()) {
      for (const syncer of chain.values()) {
        const clusterName = syncer.cluster.name
        const key = syncerKeyOf(syncer)
        if (seen.has(key)) {
          continue
        }
        seen.add(key)
        rows.push({
          pluginName: clusterName,
          chain: syncer.chain,
          chainStatus: 'active',
          syncMode: formatSyncMode(syncer),
          isLagging: lagging.has(key),
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

function formatSyncMode(
  syncer: InteropEventSyncer | undefined,
): string | undefined {
  return syncer ? `${syncer.state.name}-${syncer.state.status}` : undefined
}

function syncerKey(cluster: string, chain: string): string {
  return `${cluster}:${chain}`
}

function syncerKeyOf(syncer: InteropEventSyncer): string {
  return syncerKey(syncer.cluster.name, syncer.chain)
}
