import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { EthRpcClient, Http, UpsertMap } from '@l2beat/shared'
import type { Block, Log, LongChainName } from '@l2beat/shared-pure'
import type { ChainApi } from '../../../../config/chain/ChainApi'
import type { BlockProcessor } from '../../../types'
import type { InteropPlugin } from '../../plugins/types'
import type { InteropEventStore } from '../capture/InteropEventStore'
import { InteropEventSyncer, type SyncMode } from './InteropEventSyncer'
import { isPluginResyncable } from './isPluginResyncable'

export type PluginSyncStatus = {
  pluginName: string
  chain: string
  syncMode?: SyncMode
  toBlock?: bigint
  toTimestamp?: number
  lastError?: string
}

export class InteropSyncersManager {
  private rpcClients: { [chain: string]: EthRpcClient } = {}

  private syncers = new UpsertMap<
    string, // pluginName
    UpsertMap<LongChainName, InteropEventSyncer>
  >()

  constructor(
    private readonly eventPlugins: InteropPlugin[],
    private readonly enabledChains: LongChainName[],
    private readonly chainConfigs: ChainApi[],
    private readonly eventStore: InteropEventStore,
    private readonly db: Database,
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
        syncMode: syncer?.syncMode,
        toBlock: range.toBlock,
        toTimestamp: range.toTimestamp,
        lastError: state?.lastError ?? undefined,
      })
    }

    for (const state of syncStates) {
      const key = `${state.pluginName}:${state.chain}`
      if (seen.has(key)) {
        continue
      }
      rows.push({
        pluginName: state.pluginName,
        chain: state.chain,
        lastError: state.lastError ?? undefined,
      })
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
