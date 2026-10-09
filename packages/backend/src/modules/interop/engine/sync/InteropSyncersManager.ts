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
import type { AggregationBlocker } from '../aggregation/staleLanes'
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
  blocksAggregation: boolean
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
   * Syncers whose captured data cannot back the snapshot at `target`, judged
   * by the persisted synced range rather than instantaneous state so transient
   * errors and brief catch-ups don't count as "not ready". A pending
   * wipe/resync also blocks: its range still looks recent while the underlying
   * data is about to be deleted or rebuilt. Blockers are logged - missing range
   * as error (suspicious outside cold start), stale range or pending
   * wipe/resync as warnings.
   */
  async getAggregationBlockers(
    target: UnixTime,
    tolerance: number,
  ): Promise<AggregationBlocker[]> {
    const { rangeByKey, stateByKey } = await this.loadSyncerIndexes()
    const threshold = target - tolerance

    const { pending, missing, stale } = this.findAggregationBlockers(
      rangeByKey,
      stateByKey,
      target,
      tolerance,
    )

    if (missing.length > 0) {
      this.logger.error('Syncers have no synced range', {
        target,
        missing: missing.map(blockerKey),
      })
    }
    if (stale.length > 0) {
      this.logger.warn('Syncers are behind the aggregation threshold', {
        target,
        threshold,
        stale: stale.map((s) => ({
          syncer: blockerKey(s),
          toTimestamp: s.toTimestamp,
        })),
      })
    }
    if (pending.length > 0) {
      this.logger.warn('Syncers have a pending wipe or resync', {
        pending: pending.map(blockerKey),
      })
    }

    return [
      ...pending,
      ...missing,
      ...stale.map(({ cluster, chain }) => ({ cluster, chain })),
    ]
  }

  private async loadSyncerIndexes() {
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
   * Finds registered syncers that would block aggregation at `target`,
   * grouped by reason: a pending wipe/resync, no persisted synced range, or a
   * range older than `target - tolerance`. Syncers not registered in this
   * manager never block aggregation.
   */
  private findAggregationBlockers(
    rangeByKey: Map<string, InteropPluginSyncedRangeRecord>,
    stateByKey: Map<string, InteropPluginSyncStateRecord>,
    target: UnixTime,
    tolerance: number,
  ) {
    const threshold = target - tolerance
    const pending: AggregationBlocker[] = []
    const missing: AggregationBlocker[] = []
    const stale: (AggregationBlocker & { toTimestamp: UnixTime })[] = []

    for (const [cluster, byChain] of this.syncers) {
      for (const chain of byChain.keys()) {
        const key = syncerKey(cluster, chain)
        const state = stateByKey.get(key)
        if (state?.wipeRequired || state?.resyncRequestedFrom != null) {
          pending.push({ cluster, chain })
          continue
        }
        const range = rangeByKey.get(key)
        if (!range) {
          missing.push({ cluster, chain })
        } else if (range.toTimestamp < threshold) {
          stale.push({ cluster, chain, toTimestamp: range.toTimestamp })
        }
      }
    }

    return { pending, missing, stale }
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
   * aggregating indexer passes to `getAggregationBlockers` so that
   * `blocksAggregation` reflects whether a row makes it carry its lanes
   * forward from the previous snapshot instead of aggregating them.
   */
  async getPluginSyncStatuses(
    aggregationTarget: UnixTime,
    freshnessTolerance: number,
  ): Promise<PluginSyncStatus[]> {
    const { syncedRanges, syncStates, rangeByKey, stateByKey } =
      await this.loadSyncerIndexes()
    const { pending, missing, stale } = this.findAggregationBlockers(
      rangeByKey,
      stateByKey,
      aggregationTarget,
      freshnessTolerance,
    )
    const blockers = new Set([...pending, ...missing, ...stale].map(blockerKey))
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
        blocksAggregation: blockers.has(key),
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
        blocksAggregation: blockers.has(key),
      })
    }

    for (const chain of this.syncers.values()) {
      for (const syncer of chain.values()) {
        const clusterName = syncer.cluster.name
        const key = syncerKey(clusterName, syncer.chain)
        if (seen.has(key)) {
          continue
        }
        seen.add(key)
        rows.push({
          pluginName: clusterName,
          chain: syncer.chain,
          chainStatus: 'active',
          syncMode: formatSyncMode(syncer),
          blocksAggregation: blockers.has(key),
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

function blockerKey(blocker: AggregationBlocker): string {
  return syncerKey(blocker.cluster, blocker.chain)
}
